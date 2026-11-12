// Stories "vale a pena" (12/11/2026): print da mensagem de indicação + áudio de bom dia de cliente.
// Uso: node gerar.js  (gera os HTML/PNG; o vídeo do story 2 é montado com ffmpeg, ver comando no fim)
// Privacidade: do áudio só entra a bolha recortada da gravação de tela, sem nome, foto do contato
// nem as outras mensagens da conversa.
const { chromium } = require('playwright');
const { pathToFileURL } = require('url');
const fs = require('fs');
const path = require('path');

const MARCA = path.resolve(__dirname, '../../../../marca/fonts');
const font = (f) => pathToFileURL(path.join(MARCA, f)).href;

const base = `
@font-face{font-family:Borna;src:url('${font('Borna-Bold.otf')}');font-weight:700}
@font-face{font-family:Borna;src:url('${font('Borna-Medium.otf')}');font-weight:500}
@font-face{font-family:Borna;src:url('${font('Borna-Regular.otf')}');font-weight:400}
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:1080px;height:1920px;background:#6D413E;color:#F1EBDF;font-family:Borna,sans-serif;overflow:hidden;position:relative}
.rod{position:absolute;left:0;right:0;bottom:300px;text-align:center;font-size:32px;opacity:.7}
.linha{height:4px;background:#F26F4D;width:110px;margin:0 auto}
`;

// O card branco do story 2 fica aqui, e o vídeo recortado é sobreposto em CARD_TOP + 23
const CARD_TOP = 820;

const stories = {
  'story-01-mensagem': `
<style>${base}
.topo{position:absolute;top:250px;left:80px;right:80px;text-align:center}
h1{font-weight:700;color:#F26F4D;font-size:96px;line-height:1.02;letter-spacing:-1px}
.sub{font-size:44px;line-height:1.3;margin-top:30px}
.print{position:absolute;top:700px;left:70px;width:940px;height:628px;overflow:hidden;border-radius:36px;box-shadow:0 24px 60px rgba(0,0,0,.35)}
.fim{position:absolute;top:1420px;left:80px;right:80px;text-align:center;font-size:50px;line-height:1.25;font-weight:500}
.fim b{color:#F26F4D;font-weight:700}
</style>
<div class="topo">
  <h1>A advocacia nem sempre é fácil.</h1>
  <div class="sub">Tem prazo apertado, notícia difícil pra dar e dia que pesa.</div>
</div>
<div class="print"><img src="print-mensagem.png" style="display:block;width:100%;margin-top:-34px"></div>
<div class="fim">Mas aí chega uma mensagem assim <b>e o dia muda.</b></div>
<div class="rod">@paulacorrea.adv</div>`,

  'story-02-audio-fundo': `
<style>${base}
.topo{position:absolute;top:300px;left:80px;right:80px;text-align:center}
.kick{font-size:46px;line-height:1.3}
h1{font-weight:700;color:#F26F4D;font-size:150px;line-height:1;margin-top:26px;display:flex;align-items:center;justify-content:center;gap:34px}
h1 svg{width:130px;height:130px}
.card{position:absolute;top:${CARD_TOP}px;left:60px;width:960px;height:250px;background:#fff;border-radius:44px;box-shadow:0 24px 60px rgba(0,0,0,.35)}
.fim{position:absolute;top:1230px;left:80px;right:80px;text-align:center}
.fim p{font-size:58px;line-height:1.22;font-weight:500;margin-top:44px}
.fim b{color:#F26F4D;font-weight:700}
</style>
<div class="topo">
  <div class="kick">E hoje cedo chegou esse áudio.</div>
  <h1><svg viewBox="0 0 24 24" fill="none" stroke="#F26F4D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5 6 9H2v6h4l5 4V5z" fill="#F26F4D"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/><path d="M19 5a10 10 0 0 1 0 14"/></svg>Liga o som</h1>
</div>
<div class="card"></div>
<div class="fim">
  <div class="linha"></div>
  <p>É nesses dias que a gente sabe que <b>tudo tá valendo a pena.</b></p>
</div>
<div class="rod">@paulacorrea.adv</div>`,
};

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
  for (const [nome, corpo] of Object.entries(stories)) {
    const html = `<!doctype html><html lang="pt-br"><head><meta charset="utf-8"></head><body>${corpo}</body></html>`;
    const arq = path.join(__dirname, nome + '.html');
    fs.writeFileSync(arq, html);
    await page.goto(pathToFileURL(arq).href);
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(__dirname, nome + '.png') });
    console.log('ok', nome);
  }
  await browser.close();
})();

/* Vídeo do story 2 (rodar nesta pasta):
ffmpeg -y -loop 1 -i story-02-audio-fundo.png -t 7.4 -i "<gravação de tela>.mp4" -filter_complex
 "[1:v]crop=790:180:100:620,scale=900:206,fps=30[b];[0:v][b]overlay=90:842:shortest=1,format=yuv420p[v];
  [1:a]afade=t=out:st=6.8:d=0.6[a]" -map "[v]" -map "[a]" -t 7.4 -r 30 -c:v libx264 -crf 18 -c:a aac story-02-audio.mp4
*/
