// Versões "limpas" (sem texto) pra Paula escrever com a fonte do próprio Instagram.
const { chromium } = require('playwright');
const { pathToFileURL } = require('url');
const fs = require('fs'), path = require('path');
const css = `*{margin:0;padding:0;box-sizing:border-box}html,body{width:1080px;height:1920px;background:#6D413E;overflow:hidden;position:relative}`;
const pages = {
  'story-01-limpo': `<style>${css}.print{position:absolute;top:646px;left:70px;width:940px;height:628px;overflow:hidden;border-radius:36px;box-shadow:0 24px 60px rgba(0,0,0,.35)}</style>
<div class="print"><img src="print-mensagem.png" style="display:block;width:100%;margin-top:-34px"></div>`,
  'story-02-limpo-fundo': `<style>${css}.card{position:absolute;top:835px;left:60px;width:960px;height:250px;background:#fff;border-radius:44px;box-shadow:0 24px 60px rgba(0,0,0,.35)}</style><div class="card"></div>`,
};
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  for (const [n, c] of Object.entries(pages)) {
    const f = path.join(__dirname, n + '.html');
    fs.writeFileSync(f, `<!doctype html><html><head><meta charset="utf-8"></head><body>${c}</body></html>`);
    await p.goto(pathToFileURL(f).href); await p.waitForTimeout(300);
    await p.screenshot({ path: path.join(__dirname, n + '.png') }); console.log('ok', n);
  }
  await b.close();
})();
/* Vídeo: ffmpeg -y -loop 1 -i story-02-limpo-fundo.png -t 7.4 -i "<gravação>.mp4" -filter_complex
 "[1:v]crop=790:180:100:620,scale=900:206,fps=30[b];[0:v][b]overlay=90:857:shortest=1,format=yuv420p[v];[1:a]afade=t=out:st=6.8:d=0.6[a]"
 -map "[v]" -map "[a]" -t 7.4 -r 30 -c:v libx264 -crf 18 -c:a aac -movflags +faststart story-02-limpo.mp4 */
