// Grava o tutorial do Contrato Sob Medida no ritmo da narração.
// Uso: node gravar.js <base> <link-de-acesso> <pasta-video> <duracoes.json> <proposta.pdf> <resposta.json>
// A leitura é simulada (resposta salva de uma leitura real) para não gastar tokens nem esperar 30 s.
const { chromium } = require('playwright');
const fs = require('fs');
const [BASE, link, outDir, dursFile, pdf, respFile] = process.argv.slice(2);
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
  await ctx.route('**/api/uso', r => r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ usadas: 2, limite: 10 }) }));
  const RESP = JSON.parse(fs.readFileSync(respFile, 'utf8')); RESP.usadas = 3; RESP.limite = 10;
  await ctx.route('**/api/ler-proposta', async r => { await sleep(4200); r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(RESP) }); });
  const page = await ctx.newPage();
  page.on('dialog', d => d.accept().catch(() => {}));
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
  // entra antes de começar a valer o vídeo; a tela de login aparece por cima, num iframe
  const loginHtml = await (await fetch(BASE + '/')).text();
  await page.goto(link, { waitUntil: 'load' });
  await page.click('button[type=submit]');
  await page.waitForSelector('#propLer', { timeout: 60000 });
  await page.evaluate(() => { const b = document.getElementById('clearExample'); if (b && !document.getElementById('exampleBar').hidden) b.click(); });
  await sleep(800);
  await page.evaluate(html => {
    const f = document.createElement('iframe'); f.id = '__login'; f.srcdoc = html.replace('<head>', '<head><base href="' + location.origin + '/">').replace('</body>', '<script>document.querySelectorAll("form").forEach(function(x){x.onsubmit=function(e){e.preventDefault();};});</script></body>');
    f.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;border:0;z-index:99990;background:#F1EBDF';
    document.body.append(f);
  }, loginHtml);
  await page.frameLocator('#__login').locator('#email').waitFor();
  await sleep(1200);
  await page.mouse.move(W * 0.62, H * 0.45);
  await sleep(1200);
  const trim = (Date.now() - T0) / 1000 - 0.3;
  const marks = {};

  const at = async (loc) => { loc = loc.first(); try { await loc.scrollIntoViewIfNeeded({ timeout: 4000 }); } catch (e) { console.error('aviso: sem rolagem', String(loc), String(e).slice(0, 60)); } const b = await loc.boundingBox({ timeout: 4000 }).catch(() => null); if (!b) { console.error('aviso: elemento não achado', String(loc)); return; } await page.mouse.move(b.x + Math.min(b.width / 2, 60), b.y + b.height / 2, { steps: 28 }); await sleep(180); };
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


  const paperEl = async (sel, off = 120) => {
    await page.evaluate(([sel, off]) => {
      const box = document.querySelector('.paperbox'); const el = document.querySelector(sel);
      if (el) box.scrollTo({ top: el.getBoundingClientRect().top - box.getBoundingClientRect().top + box.scrollTop - off, behavior: 'smooth' });
    }, [sel, off]);
    await sleep(900);
  };
  await scene('abertura', async () => {
    await sleep(2500);
    await at(page.frameLocator('#__login').locator('#email'));
    await sleep(3000);
  });
  await scene('entrar', async () => {
    const lf = page.frameLocator('#__login');
    await type(lf.locator('#email'), 'camila@estudioluma.com.br');
    await sleep(700);
    await at(lf.locator('button[type=submit]'));  // só aponta: não envia o formulário
    await sleep(1600);
    await page.evaluate(() => document.getElementById('__login').remove());
    await sleep(500);
    await page.mouse.move(W * 0.3, H * 0.4, { steps: 10 });
  });
  await scene('guia', async () => {
    await click(page.locator('details.guia summary'));
    await sleep(2500);
    await at(page.locator('details.guia li').nth(3));
    await sleep(1500);
    await at(page.locator('a[href="/modelo-proposta.docx"]'));
    await sleep(2500);
    await click(page.locator('details.guia summary'));
  });
  await scene('enviar', async () => {
    await at(page.locator('#propDrop'));
    await page.mouse.down(); await page.mouse.up();
    await page.setInputFiles('#propArq', pdf);
    await sleep(1800);
    await at(page.locator('.arqs li').first());
    await sleep(1500);
    await type(page.locator('#propTexto'), 'Cliente prefere contato pelo WhatsApp.');
  });
  await scene('ler', async () => {
    await click(page.locator('#propLer'));
    await sleep(1000);
    await at(page.locator('.lendo'));
    await page.waitForSelector('.res', { timeout: 20000 });
  });
  await scene('resultado', async () => {
    await at(page.locator('.res .resumo'));
    await sleep(2200);
    await at(page.locator('.al.revisar').first());
    await sleep(2200);
    await at(page.locator('.al.atencao', { hasText: 'dias úteis' }));
    await sleep(1800);
    await at(page.locator('.al.atencao', { hasText: 'foro' }));
  });
  await scene('observacoes', async () => {
    await paperEl('#paper .prev', 160);
    await at(page.locator('#paper .prev'));
    await sleep(3500);
    await at(page.locator('#propObs'));
    await sleep(1800);
    await click(page.locator('#propObs'));
    await sleep(900);
    await at(page.locator('#paper th, #paper td', { hasText: 'Observações' }));
  });
  await scene('passos', async () => {
    await click(page.locator('#propIr'));
    await sleep(500);
    await pageTop();
    await type(page.locator('#f_contratada_email'), 'contato@estudioluma.com.br');
    await sleep(400);
    await paperTop();
    await at(page.locator('#paper .qr tr', { hasText: 'contato@estudioluma' }));
    await sleep(700);
    await click(step('Projeto'));
    await sleep(1500);
    await click(step('Valores'));
    await sleep(500);
    await at(page.locator('#paper .qr tr', { hasText: 'Honorários' }));
  });
  await scene('baixar', async () => {
    await pageTop();
    await click(page.locator('#genBtn'));
    await sleep(800);
    await at(page.locator('#status'));
  });
  await scene('termo', async () => {
    await click(page.locator('#modeTermo'));
    await sleep(900);
    await at(page.locator('#paper p', { hasText: 'APROVA' }));
    await sleep(1500);
    await click(page.locator('#modeContrato'));
  });
  await scene('limite', async () => {
    await click(step('Proposta'));
    await sleep(600);
    await pageTop();
    await at(page.locator('.uso'));
  });
  await scene('fecho', async () => {
    await page.evaluate(() => {
      const o = document.createElement('div');
      o.style.cssText = 'position:fixed;inset:0;z-index:100000;background:#6D413E;color:#F1EBDF;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:18px;opacity:0;transition:opacity .8s;font-family:Inter,sans-serif;text-align:center';
      o.innerHTML = '<div style="font-size:15px;letter-spacing:.24em;text-transform:uppercase;color:#F26F4D;font-weight:600">Estrutura Legal</div><div style="font-family:Borna,serif;font-size:84px;line-height:1">Contrato Sob <span style="color:#F26F4D">Medida</span></div><div style="font-size:24px;opacity:.9;max-width:760px">Mande a proposta. Confira o contrato.</div>';
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
