# Sistema de Gestão Consultiva

Sistema interno para registrar atendimentos consultivos (WhatsApp, e-mail, ligação,
reunião) por cliente, com histórico pesquisável e link para a pasta de documentos
de cada cliente.

## 1. Configurar o Supabase (banco de dados + login)

1. Crie uma conta gratuita em [supabase.com](https://supabase.com) e crie um novo projeto.
2. No painel do projeto, vá em **SQL Editor > New query**, cole o conteúdo do arquivo
   [`supabase/schema.sql`](supabase/schema.sql) e clique em **Run**. Isso cria as tabelas
   `clients` e `interactions`.
3. Vá em **Project Settings > API** e copie:
   - `Project URL`
   - `anon public` key
4. Crie um arquivo `.env.local` na raiz do projeto (copie de `.env.local.example`) e cole
   esses dois valores.
5. Crie os usuários da equipe em **Authentication > Users > Add user** (e-mail + senha).
   Esses são os logins que a equipe vai usar no sistema.

## 2. Rodar localmente

```bash
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) e faça login com um usuário criado no passo anterior.

## 3. Publicar (deploy)

1. Suba este projeto para um repositório no GitHub.
2. Crie uma conta em [vercel.com](https://vercel.com) e importe o repositório.
3. Em **Environment Variables**, adicione `NEXT_PUBLIC_SUPABASE_URL` e
   `NEXT_PUBLIC_SUPABASE_ANON_KEY` (os mesmos valores do `.env.local`).
4. Clique em **Deploy**. A partir daí, todo `git push` na branch principal gera um novo
   deploy automaticamente.

## Manutenção do dia a dia

- **Adicionar usuário da equipe**: Supabase > Authentication > Users > Add user.
- **Atualizar o sistema**: peça ajustes ao Claude, depois `git add`, `git commit`,
  `git push` — a Vercel publica automaticamente.
- **Backup dos dados**: Supabase > Database > Backups (backups diários automáticos no
  plano gratuito por alguns dias; para backups manuais, use **Database > Backups >
  Download**).

## Estrutura

- `src/app/(app)` — telas internas (dashboard, clientes, atendimentos, busca), exigem login
- `src/app/login` — tela de login
- `src/lib/supabase` — conexão com o Supabase
- `supabase/schema.sql` — schema do banco de dados

## Próximos passos (fase 2)

- Portal de acesso para os clientes verem seu próprio histórico e documentos
- Upload de documentos diretamente no sistema
