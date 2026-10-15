// Gera os slides do carrossel "posso pesar o clima?" (HTML + PNG 1080x1350).
// Uso: node gerar.js
const { chromium } = require('playwright');
const { pathToFileURL } = require('url');
const fs = require('fs');
const path = require('path');

// Padrão de texto sobre foto (design-guide, 2026-09-28): Borna Bold, gradiente marrom só na base,
// laranja #F26F4D no gancho (<b>) e off-white #F1EBDF no restante.
// pos = altura do centro do texto (% do quadro); bg = enquadramento da foto
const slides = [
  { img: '01.jpg', text: '<b>posso pesar o clima?</b>', pos: 80, bg: 'center 20%', big: true },
  { img: '02.jpg', text: '<b>Orçamento aprovado no WhatsApp</b> não é contrato.', pos: 78, bg: 'center' },
  { img: '03.jpg', text: '<b>Mudança na obra sem nada por escrito</b> vira briga na hora de pagar.', pos: 78, bg: 'center' },
  { img: '04.jpg', text: '<b>Pagar a obra toda adiantado</b> é abrir mão da sua única garantia.', pos: 78, bg: 'center' },
  { img: '05.jpg', text: '<b>Recebeu a obra sem vistoria?</b> Reclamar depois fica bem mais difícil.', pos: 78, bg: 'center' },
  { img: '06.jpg', text: '<b>Obra entregue</b> não é responsabilidade encerrada.', pos: 78, bg: 'center' },
  { img: '07.jpg', text: '<b>Comprou imóvel na planta e desistiu?</b> Você não perde tudo o que pagou.', pos: 78, bg: 'center' },
  { img: '08.jpg', text: '<b>Arquiteto não pode ganhar comissão</b> da loja onde o cliente compra.', pos: 78, bg: 'center' },
  { img: '09.jpg', text: 'Siga <b>@paulacorrea.adv</b> pra entender o jurídico da construção civil.', pos: 82, bg: 'center 35%', side: true },
];

const font = pathToFileURL(path.join(__dirname, '../../../../marca/fonts/Borna-Bold.otf')).href;

const html = (s) => `<!DOCTYPE html>
<html lang="pt-BR"><head><meta charset="UTF-8">
<style>
  @font-face { font-family: 'Borna'; src: url('${font}'); font-weight: 700; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { width: 1080px; height: 1350px; overflow: hidden; position: relative;
    background: #222 url('imagens/${s.img}') ${s.bg} / cover no-repeat; }
  .shade { position: absolute; left: 0; right: 0; bottom: 0; height: 58%;
    background: linear-gradient(to bottom, rgba(109,65,62,0) 0%, rgba(109,65,62,0.55) 45%, rgba(74,42,40,0.92) 100%); }
  .t { position: absolute; left: 80px; right: 80px; top: ${s.pos}%; transform: translateY(-50%);
    text-align: center; font-family: 'Borna', sans-serif; font-weight: 700;
    font-size: ${s.big ? 104 : 62}px; line-height: ${s.big ? 1.0 : 1.12}; letter-spacing: -0.5px;
    color: #F1EBDF; text-shadow: 0 2px 14px rgba(40,20,18,0.45); }
  .t b { color: #F26F4D; font-weight: 700; }
  ${s.big ? '.t { left: 430px; right: 60px; text-align: left; }' : ''}
  ${s.side ? '.t { left: 540px; right: 70px; text-align: left; font-size: 52px; }' : ''}
</style></head>
<body><div class="shade"></div><div class="t">${s.text}</div></body></html>`;

(async () => {
  const dir = __dirname;
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1080, height: 1350 } });
  for (const [i, s] of slides.entries()) {
    const n = String(i + 1).padStart(2, '0');
    const file = path.join(dir, `slide-${n}.html`);
    fs.writeFileSync(file, html(s));
    await page.goto(pathToFileURL(file).href);
    await page.waitForLoadState('networkidle');
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: path.join(dir, `slide-${n}.png`) });
    console.log('ok', n);
  }
  await browser.close();
})();
