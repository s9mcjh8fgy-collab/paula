// Gera artes de story pra responder perguntas (HTML + PNG 1080x1920).
// Uso: node gerar.js
// Todas as artes deixam o topo livre pro sticker da pergunta, que o app coloca ao tocar em
// "responder" (ou a Paula põe um texto/sticker pelo app). Sem card de pergunta nem base legal na arte,
// por decisão da Paula em 20/10/2026; pergunta e base continuam nos dados abaixo só como referência.
// Textos e base legal em ../perguntas-e-respostas.md.
const { chromium } = require('playwright');
const { pathToFileURL } = require('url');
const fs = require('fs');
const path = require('path');

const stories = [
  {
    file: 'resposta-todas-elas', tipo: 'resposta', tema: 'escuro',
    texto: '<b>Todas? 😅</b> Então você sabe bem do que eu tô falando.',
    extra: 'E repara: quase todas têm a mesma raiz. <b>O que não ficou por escrito.</b><br><br>Escopo, etapas, mudanças e pagamento bem definidos no contrato evitam a maior parte dessas dores de cabeça.',
  },
  {
    file: 'duvida-07-art-rrt', tipo: 'duvida', tema: 'claro',
    pergunta: 'Preciso de ART ou RRT pra reforma?',
    texto: '<b>Se a reforma mexe com estrutura, instalações ou precisa de projeto, sim.</b>',
    extra: 'O engenheiro registra a ART e o arquiteto, o RRT. Em apartamento, o condomínio costuma pedir esse registro antes de liberar a obra.',
    base: 'Lei 6.496/1977 · Lei 12.378/2010 · ABNT NBR 16.280',
  },
  {
    file: 'duvida-08-reforma-condominio', tipo: 'duvida', tema: 'escuro',
    pergunta: 'Vou reformar meu apartamento. Preciso avisar o condomínio?',
    texto: '<b>Sim, antes de começar.</b>',
    extra: 'A norma de reformas pede que o morador entregue ao síndico um plano de reforma, com o responsável técnico.<br><br>E vale seguir os horários de obra do regimento interno.',
    base: 'ABNT NBR 16.280 · convenção e regimento do condomínio',
  },
  {
    file: 'duvida-10-cobrar-projeto', tipo: 'duvida', tema: 'claro',
    pergunta: 'O cliente sumiu e não pagou o projeto. Ainda dá pra cobrar?',
    texto: '<b>Dá. O prazo pra cobrar honorários de profissional liberal é de 5 anos.</b>',
    extra: 'Contrato assinado e registro das entregas (e-mails, mensagens, aprovações) facilitam muito.',
    base: 'art. 206, §5º, II, do Código Civil',
  },
];

const fontes = path.join(__dirname, '../../../../marca/fonts');
const f = (n) => pathToFileURL(path.join(fontes, n)).href;
const cores = {
  escuro: { bg: '#6D413E', txt: '#F1EBDF', card: '#F1EBDF', cardTxt: '#6D413E' },
  claro: { bg: '#F1EBDF', txt: '#6D413E', card: '#6D413E', cardTxt: '#F1EBDF' },
};

const html = (s) => {
  const c = cores[s.tema];
  return `<!DOCTYPE html>
<html lang="pt-BR"><head><meta charset="UTF-8">
<style>
  @font-face { font-family: 'Borna'; src: url('${f('Borna-Bold.otf')}'); font-weight: 700; }
  @font-face { font-family: 'Borna'; src: url('${f('Borna-Medium.otf')}'); font-weight: 500; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { width: 1080px; height: 1920px; overflow: hidden; background: ${c.bg}; color: ${c.txt};
    font-family: 'Borna', sans-serif; display: flex; flex-direction: column;
    padding: 760px 96px 300px; }
  .label { font-weight: 700; font-size: 34px; letter-spacing: 3px; text-transform: uppercase; color: #F26F4D; margin-bottom: 28px; }
  .card { background: ${c.card}; color: ${c.cardTxt}; border-radius: 36px; padding: 52px 56px;
    font-weight: 700; font-size: 62px; line-height: 1.12; margin-bottom: 84px; }
  .texto { font-weight: 700; font-size: ${s.tipo === 'resposta' ? 74 : 64}px; line-height: 1.12; margin-bottom: 44px; }
  .extra { font-weight: 500; font-size: 46px; line-height: 1.3; }
  b { color: #F26F4D; font-weight: 700; }
  .rodape { margin-top: auto; font-weight: 500; font-size: 30px; line-height: 1.4; opacity: 0.85; }
  .rodape .handle { font-weight: 700; font-size: 34px; opacity: 1; margin-top: 10px; }
</style></head>
<body>
  <div class="texto">${s.texto}</div>
  <div class="extra">${s.extra}</div>
  <div class="rodape"><div class="handle">@paulacorrea.adv</div></div>
</body></html>`;
};

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
  for (const s of stories) {
    const file = path.join(__dirname, `${s.file}.html`);
    fs.writeFileSync(file, html(s));
    await page.goto(pathToFileURL(file).href);
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: path.join(__dirname, `${s.file}.png`) });
    console.log('ok', s.file);
  }
  await browser.close();
})();
