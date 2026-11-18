// Gera PNGs transparentes (1080x260) com os blocos de legenda dos reels.
// Uso: node legendas.js <lista.json>   — lista: [{"arquivo":"caminho.png","texto":"..."}]
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path'), url = require('url');
const lista = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const css = url.pathToFileURL(path.join(__dirname, 'estilo.css')).href;
const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
(async () => {
  const browser = await chromium.launch({ channel: 'msedge' });
  const page = await browser.newPage({ viewport: { width: 1080, height: 260 } });
  for (const it of lista) {
    await page.setContent(`<!doctype html><html><head><meta charset="utf-8"><link rel="stylesheet" href="${css}">
<style>html,body{background:transparent!important;width:1080px;height:260px}
.w{position:absolute;inset:0;display:flex;align-items:center;justify-content:center}
.l{max-width:940px;text-align:center;font:800 58px/1.22 Inter,sans-serif;color:#FFFDF9;background:rgba(62,38,36,.9);
padding:16px 34px;border-radius:22px;-webkit-box-decoration-break:clone;box-decoration-break:clone}</style></head>
<body><div class="w"><div class="l">${esc(it.texto)}</div></div></body></html>`, { waitUntil: 'load', timeout: 90000 });
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: it.arquivo, omitBackground: true });
  }
  await browser.close();
  console.log('legendas', lista.length);
})();
