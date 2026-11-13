// Contrato na Régua Sob Medida — servidor (Cloudflare Pages, modo avançado).
// Assinatura mensal: o acesso é liberado por e-mail no KV (manual no piloto). O assinante entra com
// link mágico, envia a proposta comercial, a IA lê e preenche o contrato a partir do banco de
// cláusulas. O contrato em Word continua sendo montado no navegador.
//
// KV (binding KV):
//   c:<email>          -> { nome, ativo, plano, limite, atualizado }   assinante
//   m:<email>          -> matriz.json própria (cliente de assessoria)  opcional
//   u:<email>:<AAAA-MM> -> nº de leituras no mês
//   t:<hash>           -> email (expira em 30 min)                     link mágico, uso único
//   r:<email>          -> 1 (expira em 60 s)                           trava de reenvio
//   l:<email>          -> 1 (expira em 90 s)                           uma leitura por vez
// Segredos: SESSION_SECRET, RESEND_API_KEY, ANTHROPIC_API_KEY, TESTE_TOKEN (opcional)
// Variáveis: EMAIL_FROM, EMAIL_REPLY_TO, LIMITE_MENSAL (padrão de leituras/mês), URL_VENDA (opcional)

import matrizPadrao from '../../../contrato-na-regua/conteudo/matriz.json';
import { lerProposta, ErroLeitura } from './leitura.js';

const SESSAO_DIAS = 90;
const MAX_ARQUIVOS = 4;
const MAX_BYTES = 24 * 1024 * 1024; // corpo da requisição, já em base64
const TIPOS = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];
const NOME = 'Contrato na Régua Sob Medida';

export default {
  async fetch(req, env) {
    const url = new URL(req.url);
    const p = url.pathname;
    try {
      if (p === '/borna.otf') return env.ASSETS.fetch(req);
      if (p === '/entrar' && req.method === 'POST') return entrar(req, env, url);
      if (p === '/acesso' && req.method === 'GET') return confirmarAcesso(url);
      if (p === '/acesso' && req.method === 'POST') return acesso(req, env);
      if (p === '/sair' && req.method === 'POST') return sair();

      const s = await sessao(req, env);
      if (p === '/api/matriz') {
        if (!s) return json({ erro: 'sem acesso' }, 401);
        return json(await matrizDe(env, s.email), 200, { 'cache-control': 'private, no-store' });
      }
      if (p === '/api/uso') {
        if (!s) return json({ erro: 'sem acesso' }, 401);
        return json({ usadas: await usadas(env, s.email), limite: limiteDe(env, s.c) }, 200, { 'cache-control': 'no-store' });
      }
      if (p === '/api/ler-proposta' && req.method === 'POST') {
        if (!s) return json({ erro: 'Sua sessão expirou. Entre de novo para continuar.' }, 401);
        return ler(req, env, s);
      }
      if (p === '/' || p === '/index.html') {
        if (!s) return html(paginaEntrar(env));
        const r = await env.ASSETS.fetch(new Request(new URL('/app', url), req));
        return new Response(r.body, { headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'private, no-store' } });
      }
      return html(pagina('Página não encontrada', '<p>Este endereço não existe. <a href="/">Voltar ao início</a>.</p>'), 404);
    } catch (e) {
      console.error(e);
      if (p.startsWith('/api/')) return json({ erro: 'Algo deu errado. Tente de novo em instantes.' }, 500);
      return html(pagina('Algo deu errado', '<p>Tente de novo em instantes. Se continuar, responda o e-mail de acesso que a gente resolve.</p>'), 500);
    }
  },
};

// ---------- Leitura da proposta ----------

async function matrizDe(env, email) {
  return (await env.KV.get('m:' + email, 'json')) || matrizPadrao;
}
const mes = () => new Date().toISOString().slice(0, 7);
async function usadas(env, email) { return Number(await env.KV.get('u:' + email + ':' + mes())) || 0; }
function limiteDe(env, c) { return Number(c && c.limite) || Number(env.LIMITE_MENSAL) || 15; }

async function ler(req, env, s) {
  if (Number(req.headers.get('content-length') || 0) > MAX_BYTES) return json({ erro: 'Arquivos grandes demais. Envie até 15 MB no total.' }, 413);
  const b = await req.json().catch(() => null);
  if (!b) return json({ erro: 'Envio inválido. Recarregue a página e tente de novo.' }, 400);
  const arquivos = Array.isArray(b.arquivos) ? b.arquivos.slice(0, MAX_ARQUIVOS + 1) : [];
  if (arquivos.length > MAX_ARQUIVOS) return json({ erro: `Envie no máximo ${MAX_ARQUIVOS} arquivos por vez.` }, 400);
  for (const a of arquivos) {
    if (!a || !TIPOS.includes(a.media_type) || typeof a.dados !== 'string' || !a.dados) return json({ erro: 'Use PDF, Word, JPG ou PNG.' }, 400);
    a.nome = String(a.nome || 'proposta').slice(0, 120);
  }
  const texto = String(b.texto || '').slice(0, 60000).trim();
  if (!arquivos.length && texto.length < 20) return json({ erro: 'Envie a proposta (arquivo) ou cole o texto dela.' }, 400);

  const limite = limiteDe(env, s.c);
  const feitas = await usadas(env, s.email);
  if (feitas >= limite) return json({ erro: `Você usou as ${limite} leituras do seu plano neste mês. O preenchimento manual continua liberado.`, usadas: feitas, limite }, 429);
  if (await env.KV.get('l:' + s.email)) return json({ erro: 'Já tem uma leitura em andamento. Aguarde terminar.' }, 429);
  await env.KV.put('l:' + s.email, '1', { expirationTtl: 90 });

  try {
    const { dados, uso } = await lerProposta(env, await matrizDe(env, s.email), { arquivos, texto });
    // só conta a leitura que deu certo
    await env.KV.put('u:' + s.email + ':' + mes(), String(feitas + 1), { expirationTtl: 400 * 86400 });
    console.log(JSON.stringify({ leitura: s.email, tokens: uso }));
    return json({ dados, usadas: feitas + 1, limite }, 200, { 'cache-control': 'no-store' });
  } catch (e) {
    if (e instanceof ErroLeitura) return json({ erro: e.message }, e.status);
    throw e;
  } finally {
    await env.KV.delete('l:' + s.email);
  }
}

// ---------- Acesso ----------

function ativo(c) {
  return !!c && (c.ativo === true || Object.values(c.transacoes || {}).some(x => x === 'ativo'));
}

async function entrar(req, env, url) {
  const f = await req.formData().catch(() => null);
  const email = normalizar(f && f.get('email'));
  if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return html(paginaEntrar(env, 'Confira o e-mail digitado.', email), 400);

  if (await env.KV.get('r:' + email)) return html(paginaEntrar(env, 'Acabamos de enviar um link para este e-mail. Aguarde um minuto antes de pedir outro.', email), 429);
  await env.KV.put('r:' + email, '1', { expirationTtl: 60 });

  const c = await env.KV.get('c:' + email, 'json');
  let linkTeste = null;
  if (ativo(c)) {
    const token = hex(crypto.getRandomValues(new Uint8Array(32)));
    await env.KV.put('t:' + (await sha256(token)), email, { expirationTtl: 1800 });
    const link = url.origin + '/acesso?t=' + token;
    const teste = env.TESTE_TOKEN && igual(req.headers.get('x-teste') || '', env.TESTE_TOKEN);
    if (teste) linkTeste = link;
    else if (env.RESEND_API_KEY) await enviarLink(env, email, c.nome, link);
    else return html(pagina('Envio indisponível', '<p>O envio de e-mail ainda não foi configurado. Tente mais tarde.</p>'), 503);
  }
  // mesma resposta com ou sem assinatura, para não revelar quem assina
  const extra = linkTeste ? `<p class="teste"><a href="${linkTeste}">${linkTeste}</a></p>` : '';
  return html(pagina('Confira o seu e-mail',
    `<p>Se <b>${esc(email)}</b> for o e-mail da sua assinatura, você vai receber em instantes um link para entrar. O link vale por 30 minutos.</p>
     <p class="muted">Não chegou? Olhe a caixa de spam e confira se é o mesmo e-mail cadastrado na assinatura.</p>
     <p><a href="/">Usar outro e-mail</a></p>${extra}`));
}

// O link do e-mail abre uma página com botão, para os antivírus de e-mail não gastarem o link.
function confirmarAcesso(url) {
  const t = url.searchParams.get('t') || '';
  return html(pagina('Entrar no ' + NOME,
    `<form method="post" action="/acesso"><input type="hidden" name="t" value="${esc(t)}">
     <button type="submit">Entrar</button></form>`));
}

async function acesso(req, env) {
  const f = await req.formData().catch(() => null);
  const t = String((f && f.get('t')) || '');
  const chave = 't:' + (await sha256(t));
  const email = t && (await env.KV.get(chave));
  if (!email) return html(pagina('Link expirado', '<p>Este link já foi usado ou passou dos 30 minutos. <a href="/">Peça um novo</a>.</p>'), 400);
  await env.KV.delete(chave);
  const exp = Date.now() + SESSAO_DIAS * 864e5;
  const valor = await assinar(env, JSON.stringify({ e: email, x: exp }));
  return new Response(null, { status: 303, headers: {
    location: '/',
    'set-cookie': `csm=${valor}; Path=/; Max-Age=${SESSAO_DIAS * 86400}; HttpOnly; Secure; SameSite=Lax`,
  } });
}

function sair() {
  return new Response(null, { status: 303, headers: { location: '/', 'set-cookie': 'csm=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax' } });
}

async function sessao(req, env) {
  const m = (req.headers.get('cookie') || '').match(/(?:^|;\s*)csm=([^;]+)/);
  if (!m) return null;
  const dados = await verificar(env, m[1]);
  if (!dados) return null;
  let s; try { s = JSON.parse(dados); } catch { return null; }
  if (!s.e || s.x < Date.now()) return null;
  // assinatura cancelada derruba o acesso mesmo com sessão aberta
  const c = await env.KV.get('c:' + s.e, 'json');
  return ativo(c) ? { email: s.e, c } : null;
}

async function enviarLink(env, email, nome, link) {
  const ola = nome ? 'Olá, ' + esc(nome.split(' ')[0]) + '!' : 'Olá!';
  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: env.EMAIL_FROM,
      to: [email],
      reply_to: env.EMAIL_REPLY_TO || undefined,
      subject: 'Seu link de acesso ao ' + NOME,
      text: `${ola.replace(/<[^>]+>/g, '')}\n\nClique no link abaixo para entrar no ${NOME}. Ele vale por 30 minutos e funciona uma vez só:\n\n${link}\n\nSe você não pediu este acesso, é só ignorar este e-mail.\n\nEstrutura Legal`,
      html: `<div style="font-family:Arial,sans-serif;color:#4A2C2A;max-width:520px;line-height:1.5">
        <p style="font-size:12px;letter-spacing:.15em;text-transform:uppercase;color:#F26F4D;font-weight:bold;margin:0 0 4px">Estrutura Legal · Sob Medida</p>
        <p style="font-size:22px;font-weight:bold;color:#6D413E;margin:0 0 20px">Contrato na Régua</p>
        <p>${ola}</p><p>Clique no botão abaixo para entrar. O link vale por 30 minutos e funciona uma vez só.</p>
        <p style="margin:24px 0"><a href="${link}" style="background:#F26F4D;color:#fff;text-decoration:none;padding:12px 22px;border-radius:8px;font-weight:bold">Entrar</a></p>
        <p style="font-size:13px;color:#7A5E58">Se você não pediu este acesso, é só ignorar este e-mail.</p></div>`,
    }),
  });
  if (!r.ok) throw new Error('Resend ' + r.status + ' ' + (await r.text()));
}

// ---------- Páginas ----------

function paginaEntrar(env, aviso = '', email = '') {
  const venda = env.URL_VENDA ? `<p class="muted">Ainda não assina? <a href="${esc(env.URL_VENDA)}">Conheça o ${NOME}</a>.</p>` : '';
  return pagina('Entrar',
    `<p>Digite o e-mail da sua assinatura. Vamos enviar um link para você entrar, sem senha.</p>
     ${aviso ? `<p class="aviso">${esc(aviso)}</p>` : ''}
     <form method="post" action="/entrar">
       <label for="email">E-mail</label>
       <input id="email" name="email" type="email" required autocomplete="email" value="${esc(email)}" placeholder="voce@escritorio.com.br">
       <button type="submit">Enviar link de acesso</button>
     </form>${venda}`);
}

function pagina(titulo, corpo) {
  return `<!doctype html><html lang="pt-br"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex">
<title>${esc(titulo)} · ${NOME}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap">
<style>
@font-face{font-family:'Borna';src:url(/borna.otf) format('opentype');font-weight:700;font-display:swap}
:root{--bg:#F1EBDF;--card:#F8F4EC;--ink:#4A2C2A;--soft:#7A5E58;--brand:#6D413E;--accent:#F26F4D;--line:#DDD1C0}
*{box-sizing:border-box}
body{margin:0;min-height:100vh;background:var(--bg);color:var(--ink);font:16px/1.55 Inter,system-ui,sans-serif;display:flex;flex-direction:column}
header{background:var(--brand);color:#F1EBDF;padding:18px 16px}
header div{max-width:460px;margin:0 auto}
header small{display:block;font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:var(--accent);font-weight:600}
header b{font-family:Borna,Georgia,serif;font-size:26px;line-height:1.1}
main{flex:1;display:flex;align-items:flex-start;justify-content:center;padding:48px 16px}
.card{width:100%;max-width:460px;background:var(--card);border:1px solid var(--line);border-radius:14px;padding:28px}
h1{font-family:Borna,Georgia,serif;color:var(--brand);font-size:28px;line-height:1.15;margin:0 0 14px}
p{margin:0 0 14px}
label{display:block;font-size:12px;letter-spacing:.06em;text-transform:uppercase;font-weight:600;color:var(--soft);margin:8px 0 6px}
input{width:100%;font:inherit;padding:12px 14px;border:1px solid var(--line);border-radius:8px;background:#fff;color:var(--ink)}
input:focus{outline:2px solid var(--accent);outline-offset:1px}
button{width:100%;margin-top:14px;font:inherit;font-weight:600;background:var(--accent);color:#fff;border:0;border-radius:8px;padding:13px;cursor:pointer}
button:hover{background:#E05E3D}
a{color:#C04E2E}
.muted{color:var(--soft);font-size:14px}
.aviso{background:#FBEFE6;border-left:3px solid var(--accent);padding:10px 12px;border-radius:6px;font-size:14px}
.teste{word-break:break-all;font-size:12px}
</style></head><body>
<header><div><small>Estrutura Legal · Sob Medida</small><b>Contrato na Régua</b></div></header>
<main><div class="card"><h1>${esc(titulo)}</h1>${corpo}</div></main>
</body></html>`;
}

// ---------- Utilidades ----------

const enc = new TextEncoder();
const html = (s, status = 200) => new Response(s, { status, headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' } });
const json = (o, status = 200, h = {}) => new Response(JSON.stringify(o), { status, headers: { 'content-type': 'application/json; charset=utf-8', ...h } });
const normalizar = e => String(e || '').trim().toLowerCase();
const esc = s => String(s).replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
const hex = b => [...new Uint8Array(b)].map(x => x.toString(16).padStart(2, '0')).join('');
const b64u = b => btoa(String.fromCharCode(...new Uint8Array(b))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const deb64u = s => Uint8Array.from(atob(s.replace(/-/g, '+').replace(/_/g, '/')), ch => ch.charCodeAt(0));

async function sha256(s) { return hex(await crypto.subtle.digest('SHA-256', enc.encode(s))); }

function igual(a, b) {
  a = String(a); b = String(b);
  if (a.length !== b.length) return false;
  let d = 0;
  for (let i = 0; i < a.length; i++) d |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return d === 0;
}

async function chave(env) {
  return crypto.subtle.importKey('raw', enc.encode(env.SESSION_SECRET), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify']);
}

async function assinar(env, dados) {
  const d = b64u(enc.encode(dados));
  return d + '.' + b64u(await crypto.subtle.sign('HMAC', await chave(env), enc.encode(d)));
}

async function verificar(env, valor) {
  const [d, s] = String(valor).split('.');
  if (!d || !s) return null;
  try {
    const ok = await crypto.subtle.verify('HMAC', await chave(env), deb64u(s), enc.encode(d));
    return ok ? new TextDecoder().decode(deb64u(d)) : null;
  } catch { return null; }
}
