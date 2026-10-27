// Grava a demonstração do Contrato na Régua no ritmo da narração.
// Uso: node gravar.js <url> <pasta-video> <duracoes.json> <logo.png> <pasta-prints>
const { chromium } = require('playwright');
const fs = require('fs');
const [url, outDir, dursFile, logo, shotsDir] = process.argv.slice(2);
const D = JSON.parse(fs.readFileSync(dursFile, 'utf8'));
const W = 1600, H = 900;
const sleep = ms => new Promise(r => setTimeout(r, ms));

const CURSOR = `
(() => {
  const mk = () => {
    const c = document.createElement('div');
    c.id = '__cur';
    c.innerHTML = '<svg width="26" height="26" viewBox="0 0 24 24"><path d="M4 2l14 9-6.5 1.3L9 19z" fill="#fff" stroke="#3E2624" stroke-width="1.6" stroke-linejoin="round"/></svg>';
    c.style.cssText = 'position:fixed;left:0;top:0;z-index:99999;pointer-events:none;transform:translate(-200px,-200px);transition:none;filter:drop-shadow(0 2px 3px rgba(0,0,0,.35))';
    const ring = document.createElement('div');
    ring.id = '__ring';
    ring.style.cssText = 'position:fixed;width:34px;height:34px;margin:-17px 0 0 -17px;border-radius:50%;border:3px solid #F26F4D;z-index:99998;pointer-events:none;opacity:0;transform:scale(.4);transition:opacity .35s, transform .35s';
    document.documentElement.append(c, ring);
    addEventListener('mousemove', e => { c.style.transform = 'translate(' + (e.clientX - 4) + 'px,' + (e.clientY - 2) + 'px)'; }, true);
    addEventListener('mousedown', e => {
      ring.style.left = e.clientX + 'px'; ring.style.top = e.clientY + 'px';
      ring.style.transition = 'none'; ring.style.opacity = '1'; ring.style.transform = 'scale(.4)';
      requestAnimationFrame(() => { ring.style.transition = 'opacity .45s, transform .45s'; ring.style.opacity = '0'; ring.style.transform = 'scale(1.3)'; });
    }, true);
  };
  if (document.readyState === 'loading') addEventListener('DOMContentLoaded', mk); else mk();
})();`;

(async () => {
  const browser = await chromium.launch({ channel: 'msedge' });
  const ctx = await browser.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: 1, acceptDownloads: true, locale: 'pt-BR' });
  await ctx.addInitScript(CURSOR);
  const page = await ctx.newPage();
  // gravação por screencast do próprio navegador (quadros JPEG com horário)
  const frDir = outDir + '/frames';
  fs.rmSync(frDir, { recursive: true, force: true }); fs.mkdirSync(frDir, { recursive: true });
  const frames = [];
  const cdp = await ctx.newCDPSession(page);
  cdp.on('Page.screencastFrame', f => {
    const name = String(frames.length).padStart(6, '0') + '.jpg';
    fs.writeFileSync(frDir + '/' + name, Buffer.from(f.data, 'base64'));
    frames.push({ name, t: f.metadata.timestamp * 1000 });
    cdp.send('Page.screencastFrameAck', { sessionId: f.sessionId }).catch(() => {});
  });
  await cdp.send('Page.startScreencast', { format: 'jpeg', quality: 92, maxWidth: W, maxHeight: H, everyNthFrame: 1 });
  const T0 = Date.now();
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForSelector('.phead');
  await page.mouse.move(W * 0.62, H * 0.45);
  await sleep(1200);
  const trim = (Date.now() - T0) / 1000 - 0.3;
  const marks = {};

  const at = async (loc) => { loc = loc.first(); try { await loc.scrollIntoViewIfNeeded({ timeout: 4000 }); } catch (e) { console.error('aviso: sem rolagem', String(e).slice(0, 80)); } const b = await loc.boundingBox({ timeout: 4000 }).catch(() => null); if (!b) { console.error('aviso: elemento não achado'); return; } await page.mouse.move(b.x + Math.min(b.width / 2, 60), b.y + b.height / 2, { steps: 28 }); await sleep(180); };
  const click = async (loc) => { await at(loc); await page.mouse.down(); await page.mouse.up(); await sleep(250); };
  const type = async (loc, txt) => { await click(loc); await page.keyboard.press('Control+A'); await page.keyboard.type(txt, { delay: 45 }); };
  const paperTo = async (texto, off = 30) => {
    await page.evaluate(([t, off]) => {
      const box = document.querySelector('.paperbox');
      const el = [...document.querySelectorAll('#paper h1,#paper h3,#paper p,#paper th')].find(e => e.textContent.includes(t));
      if (el) box.scrollTo({ top: el.getBoundingClientRect().top - box.getBoundingClientRect().top + box.scrollTop - off, behavior: 'smooth' });
    }, [texto, off]);
    await sleep(900);
  };
  const paperTop = async () => { await page.evaluate(() => document.querySelector('.paperbox').scrollTo({ top: 0, behavior: 'smooth' })); await sleep(700); };
  const pageTop = async () => { await page.evaluate(() => scrollTo({ top: 0, behavior: 'smooth' })); await sleep(700); };
  const step = name => page.locator('#steps button', { hasText: name });

  const scene = async (id, fn) => {
    const t = Date.now();
    marks[id] = (t - T0) / 1000 - trim;
    await fn();
    const rest = D[id] * 1000 + 700 - (Date.now() - t);
    if (rest > 0) await sleep(rest);
  };

  await scene('abertura', async () => {
    await sleep(1500);
    await at(page.locator('#paper .qr'));
    await page.evaluate(() => document.querySelector('.paperbox').scrollTo({ top: 520, behavior: 'smooth' }));
    await sleep(3500);
    await paperTop();
    await at(page.locator('#steps'));
  });
  await scene('voce', async () => {
    await at(page.locator('label[for=logoInput]'));
    await page.mouse.down(); await page.mouse.up();
    await page.setInputFiles('#logoInput', logo);
    await sleep(1600);
    await at(page.locator('#paper .phead img'));
    await sleep(1200);
    await at(page.locator('#f_contratada_cau'));
    await at(page.locator('#f_contratada_email'));
    await page.screenshot({ path: shotsDir + '/app-visao.png' });
  });
  await scene('cliente', async () => {
    await click(step('Cliente'));
    await sleep(600);
    await click(page.locator('.seg label', { hasText: 'Empresa' }));
    await sleep(2200);
    await at(page.locator('#f_contratante_representante'));
    await sleep(800);
    await click(page.locator('.seg label', { hasText: 'Pessoa física' }));
  });
  await scene('projeto', async () => {
    await pageTop();
    await click(step('Projeto'));
    await sleep(800);
    await at(page.locator('.chk', { hasText: 'Projeto Executivo' }).first());
    await sleep(700);
    await click(page.locator('.chk', { hasText: 'Acompanhamento Técnico de Obra' }));
    await sleep(500);
    await paperTo('O acompanhamento técnico de obra, quando contratado', 120);
    await at(page.locator('#paper p', { hasText: 'O acompanhamento técnico de obra, quando contratado' }));
  });
  await scene('escopo', async () => {
    await pageTop();
    await click(step('Escopo'));
    await sleep(700);
    await paperTo('ANEXO I', 10);
    const card = page.locator('.etapa-card').first();
    await click(card.locator('.it').filter({ has: page.locator('input[value^="Análises preliminares"]') }).locator('input[type=checkbox]'));
    await sleep(900);
    await type(page.locator('.etapa-card').first().locator('input[value^="Até 2 (duas) opções"]'), 'Até 3 (três) opções de layout para análise da CONTRATANTE');
    await sleep(500);
    await type(page.locator('.etapa-card').first().locator('[data-add$=".inclui"]'), 'Planta de demolir e construir');
    await page.keyboard.press('Enter');
    await sleep(1200);
    await page.screenshot({ path: shotsDir + '/app-escopo.png' });
  });
  await scene('valores', async () => {
    await pageTop();
    await click(step('Prazos e valores'));
    await sleep(500);
    await paperTop();
    await type(page.locator('#f_vars_revisoes'), '3');
    await sleep(400);
    await type(page.locator('#f_pagamento_valor'), '28500');
    await sleep(500);
    await at(page.locator('#paper .qr tr', { hasText: 'Honorários' }));
    await sleep(1200);
    await at(page.locator('#paper .qr tr', { hasText: 'Condições de pagamento' }));
  });
  await scene('clausulas', async () => {
    await pageTop();
    await click(step('Cláusulas'));
    await sleep(700);
    await at(page.locator('.chk', { hasText: 'Multa se o cliente desistir' }));
    await at(page.locator('.chk', { hasText: 'inteligência artificial' }));
    await at(page.locator('.chk', { hasText: 'portfólio' }));
    await click(page.locator('.chk', { hasText: 'contratar sua equipe' }));
    await sleep(400);
    await paperTo('DO NÃO ALICIAMENTO', 20);
  });
  await scene('explicacoes', async () => {
    await paperTo('DA RESPONSABILIDADE TÉCNICA', 20);
    await at(page.locator('#paper .xpl').filter({ hasText: 'O coração da proteção' }));
    await sleep(6800);
    await click(page.locator('#xplToggle'));
    await sleep(1600);
    await click(page.locator('#xplToggle'));
  });
  await scene('baixar', async () => {
    const dl = page.waitForEvent('download').catch(() => null);
    await click(page.locator('#genBtn'));
    const d = await dl; if (d) await d.saveAs(shotsDir + '/contrato-demo.docx');
    await sleep(800);
    await at(page.locator('#status'));
  });
  await scene('termo', async () => {
    await page.evaluate(() => scrollTo({ top: 0, behavior: 'smooth' }));
    await sleep(500);
    await click(page.locator('#modeTermo'));
    await sleep(800);
    await type(page.locator('#f_termo_ajustes'), 'Trocar o revestimento da varanda');
    await sleep(600);
    await page.screenshot({ path: shotsDir + '/app-termo.png' });
    await at(page.locator('#paper p', { hasText: 'APROVA' }));
  });
  await scene('fecho', async () => {
    await page.evaluate(() => {
      const o = document.createElement('div');
      o.style.cssText = 'position:fixed;inset:0;z-index:100000;background:#6D413E;color:#F1EBDF;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:18px;opacity:0;transition:opacity .8s;font-family:Inter,sans-serif;text-align:center';
      o.innerHTML = '<div style="font-size:15px;letter-spacing:.24em;text-transform:uppercase;color:#F26F4D;font-weight:600">Estrutura Legal</div><div style="font-family:Borna,serif;font-size:84px;line-height:1">Contrato na <span style="color:#F26F4D">Régua</span></div><div style="font-size:24px;opacity:.9;max-width:760px">Do orçamento aprovado ao contrato assinado, sem deixar brecha no escopo.</div>';
      document.body.append(o); requestAnimationFrame(() => o.style.opacity = '1');
      const c = document.getElementById('__cur'); if (c) c.style.display = 'none';
    });
    await sleep(1500);
  });
  await sleep(600);
  const tEnd = Date.now();
  process.on('unhandledRejection', () => {});
  cdp.removeAllListeners('Page.screencastFrame');
  await cdp.send('Page.stopScreencast').catch(() => {});
  await browser.close().catch(() => {});
  // alinha o zero do vídeo com T0 e monta um MP4 a 30 fps pelo ffmpeg do sistema
  const lines = [];
  let prev = null;
  const lead = Math.max(0, (frames[0].t - T0) / 1000);
  frames.forEach((f, i) => {
    const next = i + 1 < frames.length ? frames[i + 1].t : tEnd;
    let d = (next - f.t) / 1000;
    if (i === 0) d += lead;
    lines.push("file '" + f.name + "'", 'duration ' + Math.max(d, 0.001).toFixed(4));
    prev = f.name;
  });
  lines.push("file '" + prev + "'");
  fs.writeFileSync(frDir + '/lista.txt', lines.join('\n'));
  const vp = outDir + '/tela.mp4';
  require('child_process').execFileSync('ffmpeg', ['-y', '-f', 'concat', '-safe', '0', '-i', 'lista.txt', '-vf', 'fps=30,format=yuv420p', '-c:v', 'libx264', '-crf', '16', '-preset', 'fast', vp], { cwd: frDir, stdio: 'ignore' });
  const total = (tEnd - T0) / 1000 - trim;
  fs.writeFileSync(outDir + '/marcas.json', JSON.stringify({ trim, total, marks, video: vp }, null, 1));
  console.log(JSON.stringify({ trim, total, marks, video: vp }));
})().catch(e => { console.error(e); process.exit(1); });
