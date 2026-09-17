// Apaga um post ja publicado no Instagram. Acao publica e irreversivel — so rodar depois de
// aprovacao explicita da Paula no chat, igual ao confirmar.js.
//
// Uso:
//   node apagar.js "<pasta-do-carrossel>"       (usa o mediaId salvo em .publish-state.json)
//   node apagar.js --media-id <id>               (apaga por id direto, sem depender da pasta)

const fs = require('fs');
const path = require('path');
const { loadCreds } = require('./lib');

async function main() {
  const args = process.argv.slice(2);
  const skillRoot = path.join(__dirname, '..');
  const { token } = loadCreds(skillRoot);

  let mediaId;
  let statePath = null;
  let state = null;

  if (args[0] === '--media-id') {
    mediaId = args[1];
  } else {
    const folder = path.resolve(args[0]);
    statePath = path.join(folder, '.publish-state.json');
    if (!fs.existsSync(statePath)) throw new Error(`Nao encontrei .publish-state.json em ${folder}`);
    state = JSON.parse(fs.readFileSync(statePath, 'utf8'));
    if (!state.mediaId) throw new Error('Esse post ainda nao foi publicado (sem mediaId), nada pra apagar.');
    mediaId = state.mediaId;
  }

  console.log(`Apagando media ${mediaId}...`);
  const res = await fetch(`https://graph.facebook.com/v21.0/${mediaId}?access_token=${token}`, {
    method: 'DELETE',
  });
  const json = await res.json();
  if (json.error) {
    throw new Error(`Graph API error ao apagar: ${JSON.stringify(json.error)}`);
  }

  console.log('=== APAGADO ===', JSON.stringify(json));

  if (statePath) {
    state.deletedAt = new Date().toISOString();
    fs.writeFileSync(statePath, JSON.stringify(state, null, 2));
  }
}

main().catch(err => {
  console.error('ERRO:', err.message);
  process.exit(1);
});
