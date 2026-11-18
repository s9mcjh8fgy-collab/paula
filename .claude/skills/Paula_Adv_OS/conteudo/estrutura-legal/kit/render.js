// Renderiza em PNG todos os slide-*.html / story-*.html / capa*.html de uma pasta.
// Uso: node conteudo/estrutura-legal/kit/render.js <pasta-do-post> [arquivo.html ...]
// Tamanho: 1080x1350; se o <body> tiver class "v", 1080x1920.
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path'), url = require('url');
const dir = path.resolve(process.argv[2]);
let files = process.argv.slice(3);
if (!files.length) files = fs.readdirSync(dir).filter(f => /^(slide|story|capa|post).*\.html$/.test(f)).sort();
(async () => {
  const browser = await chromium.launch({ channel: 'msedge' });
  const page = await browser.newPage({ viewport: { width: 1080, height: 1350 } });
  for (const f of files) {
    await page.setViewportSize({ width: 1080, height: 1350 });
    await page.goto(url.pathToFileURL(path.join(dir, f)).href, { waitUntil: 'load', timeout: 90000 });
    const vert = await page.evaluate(() => document.body.classList.contains('v'));
    if (vert) await page.setViewportSize({ width: 1080, height: 1920 });
    await page.evaluate(() => document.fonts.ready);
    const out = path.join(dir, f.replace(/\.html$/, '.png'));
    await page.screenshot({ path: out });
    console.log('ok', path.basename(out));
  }
  await browser.close();
})();
