# NOVA Performing Arts

Public website for NOVA Performing Arts, a Central Texas 501(c)(3) nonprofit expanding access to youth performing arts education.

The site introduces NOVA 8 Percussion, NOVA's flagship noncompetitive marching percussion academy, under the signature line "More time to grow." It explains the access challenge the program addresses and provides clear paths for students, families, educators, donors, and community partners.

## Development

```bash
npm install
npm run dev
```

## Validation

```bash
npm run lint
npm run build
```

## Protected NOVA Hub

The owner workspace is available at `/hub`. It includes:

- a private inquiry inbox with statuses and internal notes
- public academy status, dates, location, cost, and eligibility controls
- editable homepage, academy, support, and contact copy
- an optional public announcement bar

The public contact form stores inquiries in Supabase. Public pages continue to use
the built-in fallback content if the data service is temporarily unavailable.

### Backend setup

1. Create a Supabase project.
2. Run `supabase/migrations/20260719000000_nova_hub.sql` in the Supabase SQL editor.
3. Copy `.env.example` to `.env.local` for local development.
4. Add the same four values to the Vercel project's environment variables:
   `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `NOVA_HUB_PASSWORD`,
   and `NOVA_SESSION_SECRET`.
5. Generate `NOVA_SESSION_SECRET` with a cryptographically secure random value of
   at least 32 bytes. Do not reuse the hub password.
6. Redeploy after adding the Vercel environment variables.

The Supabase service-role key is server-only. Never expose it in browser code or
prefix it with `NEXT_PUBLIC_`.
