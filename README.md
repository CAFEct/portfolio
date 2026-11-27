# CAFÉ — Portfólio + Admin CMS

Portfólio pessoal (pt-BR / EN) com painel administrativo privado. Todo o conteúdo público — projetos, certificados, experiência, habilidades, vídeos, textos, redes sociais, ordem das seções, traduções e mensagens de contato — é gerenciado pelo admin em `/admin`, sem mexer em código.

## Stack

- **Next.js 16** (App Router, Turbopack, Cache Components) + React 19 + TypeScript
- **Tailwind CSS v4** com visual "Frutiger Aero" (glass, chrome text, orb)
- **Drizzle ORM** + **Neon Postgres** (`@neondatabase/serverless`)
- **Auth.js v5** com login GitHub (apenas `ADMIN_EMAIL`)
- **next-intl** (pt-BR padrão, en) via cookie `locale`
- **Zod** para validação server-side
- **Vercel Blob** (opcional) para uploads de imagens/PDF
- **Resend** (opcional) para notificar mensagens de contato por e-mail

## Setup local

```bash
npm install
cp .env.example .env.local   # preencha as variáveis
npm run db:push              # cria as tabelas no Neon
npm run db:seed              # popula conteúdo inicial
npm run dev                  # http://localhost:3000
```

### Variáveis de ambiente (`.env.local`)

| Variável | Obrigatória | Descrição |
|---|---|---|
| `DATABASE_URL` | sim | Connection string do Neon (use a pooled). |
| `AUTH_SECRET` | sim | `openssl rand -base64 32` |
| `ADMIN_EMAIL` | sim | Único e-mail GitHub autorizado no `/admin`. |
| `AUTH_GITHUB_ID` / `AUTH_GITHUB_SECRET` | sim | OAuth App do GitHub (veja abaixo). |
| `BLOB_READ_WRITE_TOKEN` | não | Uploads de imagem/PDF no admin (`@vercel/blob`). |
| `RESEND_API_KEY` + `CONTACT_EMAIL` | não | Notificação por e-mail do formulário de contato. |
| `NEXT_PUBLIC_SITE_URL` | não | URL pública para sitemap/robots/OG (default: `http://localhost:3000`). |

### GitHub OAuth (login do admin)

1. Em *GitHub → Settings → Developer settings → OAuth Apps*, crie um app.
2. **Callback URLs**:
   - Local: `http://localhost:3000/api/auth/callback/github`
   - Produção: `https://seu-dominio.vercel.app/api/auth/callback/github`
3. Copie Client ID/Secret para `AUTH_GITHUB_ID`/`AUTH_GITHUB_SECRET`.
4. Apenas a conta cujo e-mail do perfil GitHub seja igual a `ADMIN_EMAIL` consegue entrar — os demais são rejeitados no `signIn` callback e em `requireAdmin()`.

### Vercel Blob (uploads)

1. `npm i @vercel/blob` (já instalado).
2. No projeto Vercel: *Storage → Create Database → Blob*, copie `BLOB_READ_WRITE_TOKEN`.
3. O admin valida tipo (png/jpg/webp/pdf) e tamanho (5 MB imagens, 10 MB PDFs) no servidor. Sem o token, os formulários continuam aceitando links colados.

### Neon

Crie o banco em [neon.tech](https://neon.tech), copie a connection string pooled para `DATABASE_URL` e rode `npm run db:push` + `npm run db:seed`.

## Scripts

```bash
npm run dev        # dev server
npm run build      # build de produção
npm run lint       # eslint
npm run db:push    # drizzle-kit push (sincroniza schema)
npm run db:seed    # seed inicial (só insere se vazio)
npm run db:studio  # drizzle studio
```

## Deploy na Vercel

1. Importe o repositório na Vercel.
2. Adicione todas as env vars do `.env.local` no projeto (Production + Preview).
3. Rode `npm run db:push` e `npm run db:seed` uma vez localmente apontando para o `DATABASE_URL` de produção (ou via CI).
4. Deploy. Verifique que `/admin` redireciona para o login e que contas GitHub ≠ `ADMIN_EMAIL` são bloqueadas.

## Estrutura

```
app/
  admin/(panel)/   # painel: dashboard, CRUDs, mensagens, settings, backup
  admin/login/     # login GitHub (fora do grupo protegido)
  api/             # auth (next-auth), track (analytics), admin/export
  certificados/    # listagem pública com busca/filtro/paginação
  projetos/        # listagem + detalhe por slug
components/        # UI: Navbar, AeroOrb, GlassCard, VideoEmbed, forms admin
db/                # schema Drizzle + client Neon
lib/               # admin guard, queries, settings, validação, i18n, rate limit
messages/          # dicionários next-intl (pt-BR, en)
scripts/seed.ts    # seed do banco
```

## Analytics

Eventos (`page_view`, `project_click`, `pdf_download`) são enviados via `navigator.sendBeacon` para `/api/track` — sem cookies e sem armazenar IPs. O dashboard admin mostra totais, gráfico dos últimos 30 dias e tops.
