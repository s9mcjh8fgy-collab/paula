// Registra uma demanda consultiva no Supabase (tabela `interactions`) e devolve
// o numero sequencial gerado, pra montar o nome da pasta (#00NN) no SharePoint.
//
// Uso:
//   node --env-file=../../../.env.local scripts/registrar-demanda.js '<json>'
//
// JSON de entrada:
// {
//   "cliente": "Grupo Ao Cubo",              // nome (ou parte do nome) do cliente cadastrado
//   "canal": "whatsapp",                      // whatsapp | email | telefone | presencial
//   "solicitadoPor": "Angelo",
//   "titulo": "Termo aditivo de contrato",
//   "resumo": "Cliente pediu...",
//   "resposta": "Respondido que...",          // opcional, pode ficar vazio se ainda pendente
//   "status": "done",                         // done | pending
//   "criadoPor": "paula",                     // paula | thais
//   "tags": ["contrato"]                      // opcional
// }

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SECRET_KEY = process.env.SUPABASE_SECRET_KEY;

const USER_IDS = {
  paula: "1738ba4a-30b2-4d3b-ae1f-ac417c59cdca",
  thais: "bf0aa27f-9d79-4ff8-ad16-c908bec6ddb9",
};

async function main() {
  if (!SUPABASE_URL || !SUPABASE_SECRET_KEY) {
    throw new Error(
      "Faltam NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SECRET_KEY. Rode com --env-file apontando pro .env.local."
    );
  }

  const input = JSON.parse(process.argv[2] || "{}");
  const {
    cliente,
    canal,
    solicitadoPor,
    titulo,
    resumo,
    resposta,
    status,
    criadoPor,
    tags,
  } = input;

  if (!cliente || !titulo || !resumo || !criadoPor) {
    throw new Error("Campos obrigatorios: cliente, titulo, resumo, criadoPor");
  }

  const createdBy = USER_IDS[criadoPor];
  if (!createdBy) {
    throw new Error(`criadoPor invalido: "${criadoPor}". Use "paula" ou "thais".`);
  }

  const headers = {
    apikey: SUPABASE_SECRET_KEY,
    Authorization: `Bearer ${SUPABASE_SECRET_KEY}`,
    "Content-Type": "application/json",
  };

  // 1. Localizar o cliente pelo nome
  const clientRes = await fetch(
    `${SUPABASE_URL}/rest/v1/clients?name=ilike.*${encodeURIComponent(
      cliente
    )}*&select=id,name,folder_url,status`,
    { headers }
  );
  const clients = await clientRes.json();

  if (!Array.isArray(clients) || clients.length === 0) {
    throw new Error(
      `Nenhum cliente encontrado com nome parecido com "${cliente}". Esse cliente pode ser esporadico (nao cadastrado no sistema) — nesse caso nao use este script.`
    );
  }
  if (clients.length > 1) {
    throw new Error(
      `Mais de um cliente encontrado pra "${cliente}": ${clients
        .map((c) => c.name)
        .join(", ")}. Seja mais especifico.`
    );
  }

  const client = clients[0];

  // 2. Inserir a interacao (demanda)
  const insertRes = await fetch(`${SUPABASE_URL}/rest/v1/interactions`, {
    method: "POST",
    headers: { ...headers, Prefer: "return=representation" },
    body: JSON.stringify({
      client_id: client.id,
      occurred_at: new Date().toISOString(),
      channel: canal || null,
      requested_by: solicitadoPor || null,
      title: titulo,
      summary: resumo,
      response: resposta || null,
      status: status || "pending",
      tags: tags || [],
      created_by: createdBy,
    }),
  });

  if (!insertRes.ok) {
    const errBody = await insertRes.text();
    throw new Error(`Erro ao inserir demanda: ${insertRes.status} ${errBody}`);
  }

  const [created] = await insertRes.json();
  const folderName = `#${String(created.number).padStart(4, "0")}`;

  console.log(
    JSON.stringify(
      {
        interactionId: created.id,
        number: created.number,
        folderName,
        clientId: client.id,
        clientName: client.name,
        clientFolderUrl: client.folder_url,
        demandFolderPathHint: client.folder_url
          ? `${client.folder_url} > 03_Demandas > ${folderName}`
          : "Cliente sem folder_url cadastrado no Supabase — confirmar pasta manualmente.",
      },
      null,
      2
    )
  );
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
