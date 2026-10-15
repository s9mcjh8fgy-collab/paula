// Checagem de saúde do site paulacorrea.adv.br, rodando 2x por dia via Cron Trigger
// do Cloudflare Workers. Manda e-mail via Resend só quando algo falha.
//
// Mesma lógica de checagem da skill /checar-site (checar.js), portada pra rodar
// sozinha na nuvem sem depender de uma sessão do Claude Code aberta.

const SITE_DIR = '/home2/correaadvogados/paulacorrea.adv.br';

async function cpanelCall(env, module, func, params = {}) {
  const qs = new URLSearchParams(params).toString();
  const url = `${env.CPANEL_URL.replace(/\/$/, '')}/execute/${module}/${func}${qs ? '?' + qs : ''}`;
  const res = await fetch(url, {
    headers: { Authorization: `cpanel ${env.CPANEL_USERNAME}:${env.CPANEL_API_TOKEN}` },
  });
  return res.json();
}

// Desde 14/10/2026 a hospedagem responde 403 (página padrão do LiteSpeed) e loop de
// redirecionamento no wp-login pros pedidos que saem da Cloudflare, mesmo com o site no ar
// pros visitantes. `blocked` marca esse caso, pra runCheck decidir se é alarme falso.
async function checkUrl(results, label, url, expectContains) {
  try {
    const start = Date.now();
    const res = await fetch(url, {
      redirect: 'follow',
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36',
      },
    });
    const ms = Date.now() - start;
    const text = await res.text();
    const hasContent = !expectContains || text.includes(expectContains);
    const ok = res.status >= 200 && res.status < 400 && hasContent;
    // Em falha, mostra quem respondeu (header server) e o título da página, pra saber se foi
    // Wordfence, ModSecurity da hospedagem ou o próprio WordPress
    const title = (text.match(/<title[^>]*>([^<]*)<\/title>/i) || [])[1];
    const extra = ok ? '' : ` — conteúdo inesperado ou erro (server: ${res.headers.get('server') || '?'}${title ? `, título: "${title.trim().slice(0, 120)}"` : `, corpo: "${text.replace(/\s+/g, ' ').slice(0, 160)}"`})`;
    results.push({
      label,
      ok,
      blocked: res.status === 403,
      // 403 mas com o conteúdo esperado (ex: API devolvendo os posts) = WordPress funcionando
      aliveDespite403: res.status === 403 && !!expectContains && hasContent,
      detail: `HTTP ${res.status}, ${ms}ms${extra}`,
    });
  } catch (e) {
    const loop = /redirect/i.test(e.message);
    results.push({ label, ok: false, blocked: loop, detail: loop ? 'loop de redirecionamento' : `Falhou: ${e.message}` });
  }
}

async function checkUserIni(results, env) {
  try {
    const j = await cpanelCall(env, 'Fileman', 'get_file_content', { dir: SITE_DIR, file: '.user.ini' });
    const content = j && j.data && j.data.content;
    const match = content && content.match(/memory_limit\s*=\s*(\d+)M/i);
    const value = match ? parseInt(match[1], 10) : 0;
    const ok = value >= 512;
    results.push({
      label: '.user.ini (memory_limit)',
      ok,
      detail: ok ? `presente, memory_limit=${value}M` : `ausente ou abaixo de 512M: ${JSON.stringify(j).slice(0, 200)}`,
    });
  } catch (e) {
    results.push({ label: '.user.ini (memory_limit)', ok: false, detail: `Falhou ao checar: ${e.message}` });
  }
}

async function checkErrorLog(results, env) {
  try {
    const j = await cpanelCall(env, 'Fileman', 'get_file_content', { dir: SITE_DIR, file: 'error_log' });
    const content = (j && j.data && j.data.content) || '';
    const lines = content.split('\n');
    const last2000 = lines.slice(-2000);
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const mon = months[today.getMonth()];
    const yyyy = today.getFullYear();
    const todayTag = `${dd}-${mon}-${yyyy}`;

    const fatalToday = last2000.filter((l) => l.includes('Fatal error') && l.includes(todayTag));

    results.push({
      label: 'Fatal errors no log (hoje)',
      ok: fatalToday.length === 0,
      detail:
        fatalToday.length === 0
          ? 'nenhum erro fatal hoje'
          : `${fatalToday.length} erro(s) fatal(is) hoje. Último: ${fatalToday[fatalToday.length - 1].slice(0, 200)}`,
    });
  } catch (e) {
    results.push({ label: 'Fatal errors no log', ok: false, detail: `Falhou ao ler error_log: ${e.message}` });
  }
}

async function sendAlertEmail(env, results) {
  const failed = results.filter((r) => !r.ok);
  const lines = results
    .map((r) => `${r.ok ? 'OK   ' : 'FALHA'} — ${r.label}: ${r.detail}`)
    .join('\n');

  const html = `
    <p>A checagem de saúde do site <strong>paulacorrea.adv.br</strong> encontrou ${failed.length}
    problema(s):</p>
    <pre style="background:#f5f5f5;padding:12px;border-radius:6px;white-space:pre-wrap">${lines}</pre>
  `;

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: env.ALERT_EMAIL_FROM,
      to: [env.ALERT_EMAIL_TO],
      subject: `⚠️ Problema no site (${failed.length} item${failed.length > 1 ? 's' : ''})`,
      html,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Falha ao enviar e-mail via Resend: ${res.status} ${body}`);
  }
}

async function runCheck(env) {
  const results = [];
  const siteUrl = env.SITE_URL.replace(/\/$/, '');

  await checkUrl(results, 'Site no ar (homepage)', `${siteUrl}/`);
  await checkUrl(results, 'API REST do WordPress', `${siteUrl}/wp-json/wp/v2/posts?per_page=1`, '"id"');
  await checkUrl(results, 'Login do wp-admin acessível', `${siteUrl}/wp-login.php`, 'wp-login');
  await checkUserIni(results, env);
  await checkErrorLog(results, env);

  // Se a API devolveu os posts (mesmo com 403), o WordPress está vivo: os 403/loops das
  // checagens HTTP são bloqueio da hospedagem ao robô, não site fora do ar
  const wpAlive = results.some((r) => r.ok && r.label === 'API REST do WordPress') || results.some((r) => r.aliveDespite403);
  if (wpAlive) {
    for (const r of results) {
      if (!r.ok && r.blocked) {
        r.ok = true;
        r.detail += ' (bloqueio da hospedagem ao robô; API do WordPress respondeu com conteúdo, site vivo)';
      }
    }
  }

  const allOk = results.every((r) => r.ok);

  if (!allOk) {
    await sendAlertEmail(env, results);
  }

  return { allOk, results };
}

export default {
  async scheduled(event, env, ctx) {
    ctx.waitUntil(runCheck(env));
  },

  // Endpoint manual pra testar sem esperar o cron (GET /?token=...)
  async fetch(request, env, ctx) {
    try {
      const url = new URL(request.url);
      if (url.searchParams.get('token') !== env.MANUAL_CHECK_TOKEN) {
        return new Response('Not found', { status: 404 });
      }
      const result = await runCheck(env);
      return new Response(JSON.stringify(result, null, 2), {
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (e) {
      return new Response(JSON.stringify({ error: e.message, stack: e.stack }, null, 2), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  },
};
