// Prepara a publicacao de um Reels (video) no Instagram (@paulacorrea.adv): hospeda o video e a
// capa publicamente via Cloudflare Pages, cria o container de midia REELS na Graph API e para
// ANTES de publicar. Nao posta nada ainda.
//
// Uso:
//   node preparar-reels.js "<caminho-do-video.mp4>" "<caminho-da-capa.png>" "<pasta-de-estado>"
//
// A pasta de estado deve conter um "legenda.md" com a legenda pronta (texto puro, sem cabecalho).
//
// Salva o resultado em <pasta-de-estado>/.publish-state.json pra o confirmar.js usar depois.

const fs = require('fs');
const path = require('path');
const os = require('os');
const crypto = require('crypto');
const { execSync } = require('child_process');
const { loadCreds, graphPost, graphGet } = require('./lib');

async function waitVideoFinished(containerId, token, { maxTries = 40, delayMs = 5000 } = {}) {
  for (let i = 0; i < maxTries; i++) {
    const status = await graphGet(containerId, { fields: 'status_code,status' }, token);
    if (status.status_code === 'FINISHED') return status;
    if (status.status_code === 'ERROR') {
      throw new Error(`Container ${containerId} falhou (status ERROR): ${JSON.stringify(status)}`);
    }
    console.log(`  processando video... (${status.status_code || 'IN_PROGRESS'})`);
    await new Promise(r => setTimeout(r, delayMs));
  }
  throw new Error(`Container ${containerId} nao finalizou a tempo (timeout).`);
}

async function main() {
  const [videoPath, coverPath, stateFolder] = process.argv.slice(2);
  if (!videoPath || !coverPath || !stateFolder) {
    throw new Error('Uso: node preparar-reels.js "<video.mp4>" "<capa.png>" "<pasta-de-estado>"');
  }
  const absVideo = path.resolve(videoPath);
  const absCover = path.resolve(coverPath);
  const absStateFolder = path.resolve(stateFolder);
  if (!fs.existsSync(absVideo)) throw new Error(`Video nao encontrado: ${absVideo}`);
  if (!fs.existsSync(absCover)) throw new Error(`Capa nao encontrada: ${absCover}`);
  fs.mkdirSync(absStateFolder, { recursive: true });

  const legendaPath = path.join(absStateFolder, 'legenda.md');
  if (!fs.existsSync(legendaPath)) throw new Error(`legenda.md nao encontrado em ${absStateFolder}`);
  const caption = fs.readFileSync(legendaPath, 'utf8').trim();
  if (!caption) throw new Error('legenda.md esta vazio');

  const skillRoot = path.join(__dirname, '..');
  const { token, igUserId } = loadCreds(skillRoot);

  // 1. Hospedar video + capa publicamente via Cloudflare Pages (mesmo projeto usado pra imagens),
  //    com nome unico por execucao pra evitar cache de conteudo antigo com o mesmo nome de arquivo.
  const runId = crypto.randomBytes(4).toString('hex');
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ig-publish-reels-'));
  const videoUploadName = `${runId}-${path.basename(absVideo)}`;
  const coverUploadName = `${runId}-${path.basename(absCover)}`;
  fs.copyFileSync(absVideo, path.join(tmpDir, videoUploadName));
  fs.copyFileSync(absCover, path.join(tmpDir, coverUploadName));

  console.log('Publicando video e capa no Cloudflare Pages (projeto paula-ig-media)...');
  execSync(
    `npx wrangler@latest pages deploy "${tmpDir}" --project-name=paula-ig-media --branch=main --commit-dirty=true`,
    { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }
  );
  const baseUrl = 'https://paula-ig-media.pages.dev';
  const videoUrl = `${baseUrl}/${videoUploadName}`;
  const coverUrl = `${baseUrl}/${coverUploadName}`;
  console.log(`Video: ${videoUrl}`);
  console.log(`Capa: ${coverUrl}`);

  // 2. Criar o container de midia REELS (video precisa de tempo de processamento maior que imagem)
  console.log('Criando container REELS na Graph API...');
  const result = await graphPost(`${igUserId}/media`, {
    media_type: 'REELS',
    video_url: videoUrl,
    cover_url: coverUrl,
    caption,
    share_to_feed: 'true',
  }, token);
  const creationId = result.id;
  console.log(`Container criado: ${creationId}`);

  console.log('Aguardando processamento do video (pode levar 1-2 minutos)...');
  await waitVideoFinished(creationId, token);

  const state = {
    type: 'reels',
    videoPath: absVideo,
    coverPath: absCover,
    igUserId,
    creationId,
    caption,
    baseUrl,
    videoUrl,
    coverUrl,
    preparedAt: new Date().toISOString(),
  };
  fs.writeFileSync(path.join(absStateFolder, '.publish-state.json'), JSON.stringify(state, null, 2));

  console.log('\n=== PRONTO PRA REVISAR ===');
  console.log(`Reels pronto pra publicar (video processado).`);
  console.log(`\nLegenda:\n${caption}\n`);
  console.log('Nada foi publicado ainda. Rode confirmar.js na pasta de estado so depois da aprovacao explicita da Paula.');
}

main().catch(err => {
  console.error('ERRO:', err.message);
  process.exit(1);
});
