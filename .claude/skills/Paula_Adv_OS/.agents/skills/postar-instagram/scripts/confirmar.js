// Publica de verdade no Instagram (@paulacorrea.adv) o post preparado por preparar.js.
// SO RODAR depois que a Paula aprovar explicitamente a legenda e as imagens no chat.
//
// Uso:
//   node confirmar.js "<pasta-do-carrossel>"

const fs = require('fs');
const path = require('path');
const { loadCreds, graphPost, graphGet } = require('./lib');

async function main() {
  const folder = process.argv[2];
  if (!folder) throw new Error('Uso: node confirmar.js "<pasta-do-carrossel>"');
  const absFolder = path.resolve(folder);

  const statePath = path.join(absFolder, '.publish-state.json');
  if (!fs.existsSync(statePath)) {
    throw new Error(`Nao encontrei .publish-state.json em ${absFolder}. Rode preparar.js primeiro.`);
  }
  const state = JSON.parse(fs.readFileSync(statePath, 'utf8'));
  if (state.publishedAt) {
    throw new Error(`Esse post ja foi publicado em ${state.publishedAt} (media id ${state.mediaId}). Nao vou postar de novo.`);
  }

  const skillRoot = path.join(__dirname, '..');
  const { token } = loadCreds(skillRoot);

  console.log('Publicando no Instagram...');
  const result = await graphPost(`${state.igUserId}/media_publish`, {
    creation_id: state.creationId,
  }, token);

  const mediaId = result.id;
  let permalink = null;
  try {
    const info = await graphGet(mediaId, { fields: 'permalink' }, token);
    permalink = info.permalink;
  } catch (e) {
    // permalink pode demorar a ficar disponivel, nao é fatal
  }

  state.publishedAt = new Date().toISOString();
  state.mediaId = mediaId;
  state.permalink = permalink;
  fs.writeFileSync(statePath, JSON.stringify(state, null, 2));

  console.log('\n=== PUBLICADO ===');
  console.log(`Media ID: ${mediaId}`);
  if (permalink) console.log(`Link: ${permalink}`);
}

main().catch(err => {
  console.error('ERRO:', err.message);
  process.exit(1);
});
