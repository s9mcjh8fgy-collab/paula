// Checagem de saude do site paulacorrea.adv.br: site no ar, API REST respondendo, erros fatais
// recentes no log do servidor, e se o .user.ini (memory_limit) continua no lugar.
//
// Uso: node checar.js

const fs = require('fs');
const path = require('path');

const ENV_PATH = 'C:\\Users\\user\\OneDrive - CORREA ADVOGADOS ASSOCIADOS\\Documentos - Correa\\00_Novo Diretório\\8_Claude\\.env.local';

function readEnv(envPath) {
  const content = fs.readFileSync(envPath, 'utf8');
  const out = {};
  for (const line of content.split('\n')) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (m) out[m[1]] = m[2].replace(/^"|"$/g, '').replace(/\r$/, '').trim();
  }
  return out;
}

const env = readEnv(ENV_PATH);
const SITE_URL = (env.WORDPRESS_SITE_URL || 'https://paulacorrea.adv.br').replace(/\/$/, '');
const CPANEL_URL = (env.CPANEL_URL || '').replace(/\/$/, '');
const CPANEL_USER = env.CPANEL_USERNAME;
const CPANEL_TOKEN = env.CPANEL_API_TOKEN;
const SITE_DIR = '/home2/correaadvogados/paulacorrea.adv.br';

async function cpanelCall(module, func, params = {}) {
  const qs = new URLSearchParams(params).toString();
  const url = `${CPANEL_URL}/execute/${module}/${func}${qs ? '?' + qs : ''}`;
  const res = await fetch(url, { headers: { Authorization: `cpanel ${CPANEL_USER}:${CPANEL_TOKEN}` } });
  return res.json();
}

const results = [];

async function checkUrl(label, url, expectContains) {
  try {
    const start = Date.now();
    const res = await fetch(url, { redirect: 'follow' });
    const ms = Date.now() - start;
    const text = await res.text();
    const ok = res.status >= 200 && res.status < 400 && (!expectContains || text.includes(expectContains));
    results.push({ label, ok, detail: `HTTP ${res.status}, ${ms}ms${ok ? '' : ' — conteudo inesperado ou erro'}` });
  } catch (e) {
    results.push({ label, ok: false, detail: `Falhou: ${e.message}` });
  }
}

async function checkUserIni() {
  try {
    const j = await cpanelCall('Fileman', 'get_file_content', { dir: SITE_DIR, file: '.user.ini' });
    const content = j && j.data && j.data.content;
    const ok = !!content && /memory_limit\s*=\s*512M/i.test(content);
    results.push({
      label: '.user.ini (memory_limit)',
      ok,
      detail: ok ? 'presente, memory_limit=512M' : `ausente ou alterado: ${JSON.stringify(j).slice(0, 200)}`,
    });
  } catch (e) {
    results.push({ label: '.user.ini (memory_limit)', ok: false, detail: `Falhou ao checar: ${e.message}` });
  }
}

async function checkErrorLog() {
  try {
    const j = await cpanelCall('Fileman', 'get_file_content', { dir: SITE_DIR, file: 'error_log' });
    const content = (j && j.data && j.data.content) || '';
    const lines = content.split('\n');
    const last2000 = lines.slice(-2000);
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const mon = months[today.getMonth()];
    const yyyy = today.getFullYear();
    const todayTag = `${dd}-${mon}-${yyyy}`;

    const fatalToday = last2000.filter(l => l.includes('Fatal error') && l.includes(todayTag));
    const fatalRecent = last2000.filter(l => l.includes('Fatal error')).slice(-5);

    results.push({
      label: 'Fatal errors no log (hoje)',
      ok: fatalToday.length === 0,
      detail: fatalToday.length === 0
        ? 'nenhum erro fatal hoje'
        : `${fatalToday.length} erro(s) fatal(is) hoje. Ultimo: ${fatalToday[fatalToday.length - 1].slice(0, 200)}`,
    });

    if (fatalToday.length === 0 && fatalRecent.length > 0) {
      results.push({
        label: 'Fatal errors no log (historico recente)',
        ok: true,
        detail: `sem erro hoje, mas ${fatalRecent.length} nas ultimas ~2000 linhas do log (nao e hoje, so referencia): ${fatalRecent[fatalRecent.length - 1].slice(0, 150)}`,
      });
    }
  } catch (e) {
    results.push({ label: 'Fatal errors no log', ok: false, detail: `Falhou ao ler error_log: ${e.message}` });
  }
}

async function main() {
  await checkUrl('Site no ar (homepage)', `${SITE_URL}/`);
  await checkUrl('API REST do WordPress', `${SITE_URL}/wp-json/wp/v2/posts?per_page=1`, '"id"');
  await checkUrl('Login do wp-admin acessivel', `${SITE_URL}/wp-login.php`, 'wp-login');
  await checkUserIni();
  await checkErrorLog();

  console.log('\n=== CHECAGEM DE SAUDE DO SITE ===\n');
  let allOk = true;
  for (const r of results) {
    console.log(`${r.ok ? 'OK ' : 'FALHA'} — ${r.label}: ${r.detail}`);
    if (!r.ok) allOk = false;
  }
  console.log('\n' + (allOk ? 'TUDO OK.' : 'ATENCAO: pelo menos um item precisa de revisao.'));

  const stateFile = path.join(__dirname, '..', '.last-check.json');
  const today = new Date().toISOString().slice(0, 10);
  fs.writeFileSync(stateFile, JSON.stringify({ date: today, allOk, results }, null, 2));

  process.exit(allOk ? 0 : 1);
}

main().catch(e => {
  console.error('ERRO GERAL:', e.message);
  process.exit(1);
});
