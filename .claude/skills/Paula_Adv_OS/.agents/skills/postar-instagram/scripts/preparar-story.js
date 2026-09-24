// Prepara um story (imagem unica 1080x1920) pra publicar no Instagram. Mesma logica do preparar.js
// de feed, mas sem carrossel/legenda — stories nao tem legenda, so a imagem.
//
// Uso:
//   node preparar-story.js "<caminho-da-imagem.png>" "<pasta-de-saida-do-estado>"
//
// Salva o estado em <pasta-de-saida-do-estado>/.publish-state.json (mesmo formato do feed, o
// confirmar.js e o apagar.js funcionam igual pros dois).

const fs = require('fs');
const path = require('path');
const os = require('os');
const crypto = require('crypto');
const { execSync } = require('child_process');
const { loadCreds, graphPost, waitUntilFinished } = require('./lib');

async function main() {
  const imagePath = process.argv[2];
  const stateFolder = process.argv[3];
  if (!imagePath || !stateFolder) {
    throw new Error('Uso: node preparar-story.js "<imagem.png>" "<pasta-de-saida-do-estado>"');
  }
  const absImage = path.resolve(imagePath);
  const absFolder = path.resolve(stateFolder);
  if (!fs.existsSync(absImage)) throw new Error(`Imagem nao encontrada: ${absImage}`);
  fs.mkdirSync(absFolder, { recursive: true });

  const skillRoot = path.join(__dirname, '..');
  const { token, igUserId } = loadCreds(skillRoot);

  // Nome de arquivo unico por execucao — ver preparar.js pra explicacao (o Instagram pode ignorar
  // query string de cache-busting e servir conteudo antigo do mesmo nome de arquivo).
  const runId = crypto.randomBytes(4).toString('hex');
  const uploadName = `${runId}-${path.basename(absImage)}`;
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ig-story-'));
  fs.copyFileSync(absImage, path.join(tmpDir, uploadName));

  console.log('Publicando imagem no Cloudflare Pages (projeto paula-ig-media)...');
  execSync(
    `npx wrangler@latest pages deploy "${tmpDir}" --project-name=paula-ig-media --branch=main --commit-dirty=true`,
    { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }
  );
  const baseUrl = 'https://paula-ig-media.pages.dev';
  const imageUrl = `${baseUrl}/${uploadName}`;
  console.log(`Imagem publicada em: ${imageUrl}`);

  const result = await graphPost(`${igUserId}/media`, {
    image_url: imageUrl,
    media_type: 'STORIES',
  }, token);
  console.log(`Container criado: ${result.id}`);

  await waitUntilFinished(result.id, token);

  const state = {
    folder: absFolder,
    igUserId,
    creationId: result.id,
    type: 'story',
    image: uploadName,
    baseUrl,
    preparedAt: new Date().toISOString(),
  };
  fs.writeFileSync(path.join(absFolder, '.publish-state.json'), JSON.stringify(state, null, 2));

  console.log('\n=== PRONTO PRA REVISAR ===');
  console.log('Story (sem legenda, stories nao tem texto de legenda).');
  console.log('Nada foi publicado ainda. Rode confirmar.js na mesma pasta so depois da aprovacao explicita da Paula.');
}

main().catch(err => {
  console.error('ERRO:', err.message);
  process.exit(1);
});
