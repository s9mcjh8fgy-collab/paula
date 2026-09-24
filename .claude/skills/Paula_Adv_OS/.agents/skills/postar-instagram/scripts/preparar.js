// Prepara uma publicacao no Instagram (@paulacorrea.adv): hospeda as imagens publicamente via
// Cloudflare Pages, cria os containers de midia na Graph API (imagem unica ou carrossel) e para
// ANTES de publicar. Nao posta nada ainda.
//
// Uso:
//   node preparar.js "<pasta-do-carrossel>"
//
// A pasta deve conter slide-01.png, slide-02.png... e carousel-text.md (com "## Legenda Instagram").
//
// Salva o resultado em <pasta>/.publish-state.json pra o confirmar.js usar depois.

const fs = require('fs');
const path = require('path');
const os = require('os');
const crypto = require('crypto');
const { execSync } = require('child_process');
const { loadCreds, graphPost, waitUntilFinished, extractCaption, listSlideImages } = require('./lib');

async function main() {
  const folder = process.argv[2];
  if (!folder) throw new Error('Uso: node preparar.js "<pasta-do-carrossel>"');
  const absFolder = path.resolve(folder);
  if (!fs.existsSync(absFolder)) throw new Error(`Pasta nao encontrada: ${absFolder}`);

  const skillRoot = path.join(__dirname, '..');
  const { token, igUserId } = loadCreds(skillRoot);

  const carouselTextPath = path.join(absFolder, 'carousel-text.md');
  if (!fs.existsSync(carouselTextPath)) throw new Error(`carousel-text.md nao encontrado em ${absFolder}`);
  const caption = extractCaption(carouselTextPath);
  if (!caption) throw new Error('Nao encontrei a secao "## Legenda Instagram" em carousel-text.md');

  const images = listSlideImages(absFolder);
  if (images.length === 0) throw new Error(`Nenhum slide-NN.png encontrado em ${absFolder}`);

  console.log(`Encontradas ${images.length} imagem(ns): ${images.join(', ')}`);

  // 1. Hospedar as imagens publicamente via Cloudflare Pages (deploy temporario, so pra a Graph
  //    API conseguir baixar a imagem na hora de criar o container).
  //
  //    IMPORTANTE: nome de arquivo tem que ser unico por execucao. O Instagram/Meta cacheia a
  //    URL da imagem e pode IGNORAR query string de cache-busting (?v=...), servindo o conteudo
  //    antigo do mesmo nome de arquivo (ex: slide-01.png de um post publicou o slide-01.png de
  //    OUTRO post, por reuso de nome entre pastas — ja aconteceu, ver memoria
  //    project_wordfence_bloqueia_post_api / historico do dia 2026-09-24). Por isso o nome do
  //    arquivo em si leva um prefixo unico, nao so a query string.
  const runId = crypto.randomBytes(4).toString('hex');
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ig-publish-'));
  const uploadNames = {};
  for (const img of images) {
    const uploadName = `${runId}-${img}`;
    uploadNames[img] = uploadName;
    fs.copyFileSync(path.join(absFolder, img), path.join(tmpDir, uploadName));
  }

  console.log('Publicando imagens no Cloudflare Pages (projeto paula-ig-media)...');
  execSync(
    `npx wrangler@latest pages deploy "${tmpDir}" --project-name=paula-ig-media --branch=main --commit-dirty=true`,
    { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }
  );
  // Usa sempre o dominio de producao (paula-ig-media.pages.dev), nao a URL de deploy com hash —
  // o certificado SSL do subdominio com hash pode demorar a ficar disponivel em projetos/deploys
  // novos, enquanto o dominio de producao ja fica pronto na hora.
  const baseUrl = 'https://paula-ig-media.pages.dev';
  console.log(`Imagens publicadas em: ${baseUrl} (prefixo ${runId})`);

  // 2. Criar um container de midia por imagem
  const isCarousel = images.length > 1;
  const childIds = [];
  for (const img of images) {
    const imageUrl = `${baseUrl}/${uploadNames[img]}`;
    const params = { image_url: imageUrl };
    if (isCarousel) params.is_carousel_item = 'true';
    const result = await graphPost(`${igUserId}/media`, params, token);
    console.log(`Container criado pra ${img} (${uploadNames[img]}): ${result.id}`);
    childIds.push(result.id);
  }

  // 3. Esperar cada child finalizar (importante antes de combinar num carrossel)
  if (isCarousel) {
    for (const id of childIds) {
      await waitUntilFinished(id, token);
    }
  }

  // 4. Criar o container final (carrossel combinando os children, ou a propria imagem unica ja
  //    recebe a legenda direto se for so uma)
  let finalContainerId;
  if (isCarousel) {
    const carouselResult = await graphPost(`${igUserId}/media`, {
      media_type: 'CAROUSEL',
      children: childIds.join(','),
      caption,
    }, token);
    finalContainerId = carouselResult.id;
  } else {
    // imagem unica: recriar o container ja com a legenda (a Graph API nao deixa editar caption
    // depois de criado, entao refaz o container simples com caption incluida)
    const imageUrl = `${baseUrl}/${uploadNames[images[0]]}`;
    const result = await graphPost(`${igUserId}/media`, { image_url: imageUrl, caption }, token);
    finalContainerId = result.id;
  }

  await waitUntilFinished(finalContainerId, token);

  const state = {
    folder: absFolder,
    igUserId,
    creationId: finalContainerId,
    caption,
    images,
    baseUrl,
    preparedAt: new Date().toISOString(),
  };
  fs.writeFileSync(path.join(absFolder, '.publish-state.json'), JSON.stringify(state, null, 2));

  console.log('\n=== PRONTO PRA REVISAR ===');
  console.log(`Post: ${images.length} imagem(ns) — ${isCarousel ? 'carrossel' : 'imagem unica'}`);
  console.log(`\nLegenda:\n${caption}\n`);
  console.log('Nada foi publicado ainda. Rode confirmar.js na mesma pasta so depois da aprovacao explicita da Paula.');
}

main().catch(err => {
  console.error('ERRO:', err.message);
  process.exit(1);
});
