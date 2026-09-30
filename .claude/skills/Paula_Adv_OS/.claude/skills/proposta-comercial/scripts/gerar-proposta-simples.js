// Gera a Proposta Simples (1 página A4) a partir de um JSON.
// Uso: node gerar-proposta-simples.js dados.json "saida.pdf" [--png preview.png]
//
// dados.json:
// {
//   "destinatario": ["À Gisele", "Kipbabykids"],
//   "descricao": "Texto corrido da descrição do serviço",
//   "providencias": ["item 1", "item 2"],
//   "honorarios": ["R$ 600,00 (seiscentos reais) de entrada", "..."],
//   "observacao": "Custas processuais ... (opcional; omitir para não exibir)",
//   "data": "22/05/2026",
//   "validade": "05 dias"
// }
// Trechos entre **asteriscos** viram negrito.

const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');

const skillDir = path.resolve(__dirname, '..');
const workspace = path.resolve(skillDir, '..', '..', '..');
let playwright;
try { playwright = require('playwright'); }
catch { playwright = require(path.resolve(workspace, '..', '..', '..', 'node_modules', 'playwright')); }

const [jsonPath, outPdf, flag, outPng] = process.argv.slice(2);
if (!jsonPath || !outPdf) {
  console.error('Uso: node gerar-proposta-simples.js dados.json saida.pdf [--png preview.png]');
  process.exit(1);
}

const d = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/\*\*(.+?)\*\*/g, '<b>$1</b>');
const li = arr => (arr || []).map(i => `<li>${esc(i)}</li>`).join('');

const html = fs.readFileSync(path.join(skillDir, 'templates', 'proposta-simples.html'), 'utf8')
  .replace(/{{ASSETS}}/g, pathToFileURL(path.join(skillDir, 'assets')).href)
  .replace(/{{FONTS}}/g, pathToFileURL(path.join(workspace, 'marca', 'fonts')).href)
  .replace('{{DESTINATARIO}}', (d.destinatario || []).map(l => `<p>${esc(l)}</p>`).join(''))
  .replace('{{DESCRICAO}}', esc(d.descricao || ''))
  .replace('{{PROVIDENCIAS}}', li(d.providencias))
  .replace('{{HONORARIOS}}', li(d.honorarios))
  .replace('{{OBSERVACAO}}', d.observacao ? `<p class="obs"><b>Observação</b>: ${esc(d.observacao)}</p>` : '')
  .replace('{{DATA}}', esc(d.data || ''))
  .replace('{{VALIDADE}}', esc(d.validade || '05 dias'));

(async () => {
  const tmp = path.join(path.dirname(path.resolve(outPdf)), '.proposta-simples.html');
  fs.writeFileSync(tmp, html, 'utf8');
  const browser = await playwright.chromium.launch();
  const page = await browser.newPage();
  await page.goto(pathToFileURL(tmp).href, { waitUntil: 'networkidle' });
  const overflow = await page.evaluate(() => {
    const s = [...document.querySelectorAll('section')].pop();
    const a = document.querySelector('.rodape-assinatura');
    return s.getBoundingClientRect().bottom > a.getBoundingClientRect().top - 10;
  });
  if (overflow) console.warn('ATENÇÃO: o texto está invadindo a área da assinatura. Enxugar o conteúdo.');
  await page.pdf({ path: outPdf, format: 'A4', printBackground: true, margin: { top: 0, right: 0, bottom: 0, left: 0 } });
  if (flag === '--png' && outPng) {
    await page.setViewportSize({ width: 794, height: 1123 });
    await page.screenshot({ path: outPng, fullPage: false });
  }
  await browser.close();
  fs.unlinkSync(tmp);
  console.log('PDF gerado:', outPdf);
})();
