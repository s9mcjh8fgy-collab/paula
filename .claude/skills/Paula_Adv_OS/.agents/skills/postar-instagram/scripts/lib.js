const fs = require('fs');
const path = require('path');

const GRAPH_VERSION = 'v21.0';
const GRAPH_BASE = `https://graph.facebook.com/${GRAPH_VERSION}`;

function readEnvFile(envPath) {
  const content = fs.readFileSync(envPath, 'utf8');
  const out = {};
  for (const line of content.split('\n')) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (m) out[m[1]] = m[2].replace(/^"|"$/g, '').replace(/\r$/, '').trim();
  }
  return out;
}

function loadCreds(skillRoot) {
  // Reusa o token do meta-ads-ratos (mesmo app, mesmas permissoes).
  const metaAdsEnv = path.join(skillRoot, '..', 'meta-ads-ratos', '.env');
  const env = readEnvFile(metaAdsEnv);
  const token = env.META_ADS_TOKEN;
  if (!token) throw new Error(`META_ADS_TOKEN nao encontrado em ${metaAdsEnv}`);

  const contasPath = path.join(skillRoot, '..', 'meta-ads-ratos', 'contas.yaml');
  const contasRaw = fs.readFileSync(contasPath, 'utf8');
  // parse simples: pega o bloco "paula:" e o instagram_id dentro dele
  const m = contasRaw.match(/paula:\s*[\s\S]*?instagram_id:\s*"?(\d+)"?/);
  if (!m) throw new Error('instagram_id da conta "paula" nao encontrado em contas.yaml');
  const igUserId = m[1];

  return { token, igUserId };
}

async function graphPost(pathSegment, params, token) {
  const url = `${GRAPH_BASE}/${pathSegment}`;
  const body = new URLSearchParams({ ...params, access_token: token });
  const res = await fetch(url, { method: 'POST', body });
  const json = await res.json();
  if (json.error) {
    throw new Error(`Graph API error em ${pathSegment}: ${JSON.stringify(json.error)}`);
  }
  return json;
}

async function graphGet(pathSegment, params, token) {
  const qs = new URLSearchParams({ ...params, access_token: token });
  const url = `${GRAPH_BASE}/${pathSegment}?${qs}`;
  const res = await fetch(url);
  const json = await res.json();
  if (json.error) {
    throw new Error(`Graph API error em ${pathSegment}: ${JSON.stringify(json.error)}`);
  }
  return json;
}

async function waitUntilFinished(containerId, token, { maxTries = 20, delayMs = 3000 } = {}) {
  for (let i = 0; i < maxTries; i++) {
    const status = await graphGet(containerId, { fields: 'status_code' }, token);
    if (status.status_code === 'FINISHED') return status;
    if (status.status_code === 'ERROR') {
      throw new Error(`Container ${containerId} falhou (status ERROR): ${JSON.stringify(status)}`);
    }
    await new Promise(r => setTimeout(r, delayMs));
  }
  throw new Error(`Container ${containerId} nao finalizou a tempo (timeout).`);
}

function extractCaption(carouselTextPath) {
  const content = fs.readFileSync(carouselTextPath, 'utf8');
  const lines = content.split('\n');
  let capturing = false;
  const out = [];
  for (const line of lines) {
    if (/^##\s+Legenda Instagram/i.test(line)) {
      capturing = true;
      continue;
    }
    if (capturing && /^##\s+/.test(line)) break;
    if (capturing) out.push(line);
  }
  return out.join('\n').trim();
}

function listSlideImages(folder) {
  const files = fs.readdirSync(folder)
    .filter(f => /^slide-\d+\.png$/.test(f))
    .sort((a, b) => {
      const na = parseInt(a.match(/\d+/)[0], 10);
      const nb = parseInt(b.match(/\d+/)[0], 10);
      return na - nb;
    });
  return files;
}

module.exports = {
  GRAPH_BASE,
  loadCreds,
  graphPost,
  graphGet,
  waitUntilFinished,
  extractCaption,
  listSlideImages,
};
