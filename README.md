## Stack

- Next.js 16 (App Router, TypeScript, Tailwind CSS v4)
- Supabase JS client (client-side auth helper wired up in `src/lib/supabase.ts`)
- shadcn/ui (Radix + Tailwind component primitives)
- React Hook Form + Zod for type-safe forms with validation

The default page (`src/app/page.tsx`) shows how these tools work together to
create a Supabase email sign-up flow with shadcn/ui components.

## Local setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create `.env.local` in the project root and provide your Supabase project
   credentials. You can find them in the Supabase dashboard under **Project
   Settings → API**.

   ```
   NEXT_PUBLIC_SUPABASE_URL=your-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   SUPABASE_URL=your-project-url # optional, falls back to NEXT_PUBLIC_SUPABASE_URL
   ```

3. Start the dev server:

   ```bash
   npm run dev
   ```

4. Visit [http://localhost:3000](http://localhost:3000) and use the sample form
   to create Supabase auth users. Validation runs locally (Zod) before the form
   data is sent to Supabase.

## Project structure

- `src/app/layout.tsx` – global metadata + fonts.
- `src/app/page.tsx` – example Supabase sign-up form using shadcn/ui + RHF + Zod.
- `src/lib/supabase.ts` – Supabase browser client factory.
- `src/lib/supabase-server.ts` – Supabase service-role client for API routes.
- `src/app/api/ticket/route.ts` – POST endpoint to seed/create placeholder tickets.
- `src/app/api/tickets/route.ts` – GET endpoint listing latest tickets from Supabase.
- `src/app/api/ticket/reply/route.ts` – POST endpoint that enriches ticket replies.
- `src/components/ui/*` – shadcn/ui component layer, ready for extension.

## Scripts

- `npm run dev` – start the Next.js dev server.
- `npm run build` – create a production build.
- `npm start` – run the production build locally.
- `npm run lint` – run ESLint.
