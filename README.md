## Stack

- Next.js 16 (App Router, TypeScript, Tailwind CSS v4)
- Supabase JS client (browser and server-side clients)
- shadcn/ui (Radix + Tailwind component primitives)
- React Hook Form + Zod for type-safe forms with validation

This project demonstrates a ticket management system with automatic enrichment:
tickets can be created, listed, and updated with replies that automatically
calculate urgency, importance, and sentiment based on message content.

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

4. Visit [http://localhost:3000](http://localhost:3000) to access the debug page.
   You can create tickets, view the ticket list, and submit replies that are
   automatically enriched with urgency, importance, and sentiment analysis.

## Project structure

- `src/app/layout.tsx` – global metadata, fonts, and navigation header.
- `src/app/page.tsx` – home page that redirects to `/debug`.
- `src/app/debug/page.tsx` – debug page with ticket list and reply form.
- `src/app/create/page.tsx` – page for creating new tickets.
- `src/supabase/supabase.ts` – Supabase browser client factory.
- `src/supabase/supabase-server.ts` – Supabase service-role client for API routes.
- `src/app/api/ticket/route.ts` – POST endpoint to seed/create placeholder tickets.
- `src/app/api/tickets/route.ts` – GET endpoint listing latest tickets from Supabase.
- `src/app/api/ticket/reply/route.ts` – POST endpoint that enriches ticket replies with urgency, importance, and sentiment.
- `src/components/Forms/FormCreateTicket.tsx` – reusable form component for creating tickets.
- `src/components/Forms/FormTIcketReply.tsx` – reusable form component for submitting ticket replies.
- `src/components/Lists/ListTickets.tsx` – reusable component displaying a list of tickets from Supabase.
- `src/components/ui/*` – shadcn/ui component layer (button, card, form, input, label, textarea, badge).

## Scripts

- `npm run dev` – start the Next.js dev server.
- `npm run build` – create a production build.
- `npm start` – run the production build locally.
- `npm run lint` – run ESLint.
