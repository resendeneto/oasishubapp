# OASIS HUB — Oásis Business

Webapp responsivo (mobile + PC), **PWA com notificações push**, conectado ao **Supabase** (banco + auth) e pronto para deploy na **Vercel**.

Perfis: **ADM** (mentor) e **Oásico**. Recursos: IOE (5 pilares × 10), fase automática, Roda da Vida, Roda Empresarial, mentorias (individual e em grupo), atividades, agenda com Google Agenda, notificações em tempo real + push.

---

## 1) Banco de dados (Supabase)

Projeto: **OasisHub** (`vjgqsoejejiexevmcoff`, região São Paulo).

1. Abra o **SQL Editor** do projeto no painel do Supabase.
2. Rode, em ordem, o conteúdo de:
   - `supabase/migrations/0001_schema.sql`
   - `supabase/migrations/0002_rls.sql`
   - `supabase/migrations/0003_triggers_realtime.sql`
3. (Opcional, para testar rápido) Em **Authentication → Providers → Email**, desative "Confirm email" para entrar sem confirmação por e-mail.
4. Em **Project Settings → API**, copie a **Project URL** e a **anon public key**.
5. Crie o primeiro ADM: cadastre-se pelo app e depois rode no SQL Editor:
   ```sql
   update public.profiles set role = 'adm' where email = 'SEU-EMAIL';
   delete from public.oasicos where profile_id = (select id from public.profiles where email = 'SEU-EMAIL');
   ```

## 2) Variáveis de ambiente

Copie `.env.example` para `.env` e preencha:
```
VITE_SUPABASE_URL=https://vjgqsoejejiexevmcoff.supabase.co
VITE_SUPABASE_ANON_KEY=<sua anon public key>
VITE_VAPID_PUBLIC_KEY=<chave pública VAPID — ver passo 4>
```

## 3) Rodar local
```
npm install
npm run dev
```

## 4) Notificações push (Web Push)

1. Gere as chaves VAPID:
   ```
   npx web-push generate-vapid-keys
   ```
   Use a **pública** em `VITE_VAPID_PUBLIC_KEY`.
2. Faça deploy da Edge Function e configure os segredos:
   ```
   supabase functions deploy send-push --project-ref vjgqsoejejiexevmcoff
   supabase secrets set VAPID_PUBLIC_KEY=... VAPID_PRIVATE_KEY=... VAPID_SUBJECT=mailto:voce@dominio.com --project-ref vjgqsoejejiexevmcoff
   ```
3. No app, abra o sino → **Ativar push neste aparelho**. No celular, instale o app na tela inicial (PWA) para receber push fora do app (Android Chrome; iOS 16.4+ quando instalado).

> O **centro de avisos em tempo real** (sino) já funciona sem o passo de push, via Supabase Realtime. O Web Push (passo 4) adiciona a notificação no sistema operacional.

## 5) GitHub (3 comandos)
```
git init && git add . && git commit -m "OASIS HUB"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/oasis-hub.git && git push -u origin main
```

## 6) Deploy na Vercel
1. Importe o repositório em vercel.com → New Project.
2. Framework: **Vite** (detectado). Build: `npm run build`. Output: `dist`.
3. Em **Environment Variables**, adicione `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_VAPID_PUBLIC_KEY`.
4. Deploy. O `vercel.json` já trata as rotas SPA.

---

## O que está conectado
- **Auth real** (login/cadastro Supabase). Cadastro cria perfil + Oásico automaticamente (trigger).
- **RLS**: ADM vê/edita tudo; Oásico só os próprios dados; observações privadas do mentor ficam em tabela separada (invisíveis ao Oásico).
- **Leitura e escrita** de Oásicos, IOE (resposta + notas por pilar + respostas), rodas (histórico + snapshot), mentorias, atividades, eventos em grupo.
- **Notificações**: criadas ao agendar mentoria, criar atividade, marcar mentoria em grupo e ao receber novo IOE; entregues em tempo real (sino) e via push (Edge Function).
- **PWA**: manifest + service worker + ícones.

## Estrutura
```
src/
  App.jsx            # auth + dados + notificações (orquestrador)
  OasisApp.jsx       # todas as telas ADM/Oásico (UI validada)
  screens/Login.jsx  # login/cadastro Supabase
  lib/
    supabase.js      # cliente
    core.js          # constantes/cálculo
    api.js           # carga + persistência (reconciliação)
    push.js          # Web Push
public/              # manifest, sw.js, ícones
supabase/            # migrações SQL + Edge Function send-push
```
