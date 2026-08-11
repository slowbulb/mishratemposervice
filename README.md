# Mishra Tempo Service

Concept album app: multi-album support, an immersive 2.5D spatial UI where
tracks are everyday objects (an auto-rickshaw, a chai cup, etc.) drifting
through space. See `BUILD_SPEC_v2.md` for the full build spec.

## Stack

- React + Vite + TypeScript
- React Router
- Framer Motion
- Supabase (Postgres, Auth, Storage)
- TanStack Query
- Deployed on Vercel

## Development

```
npm install
npm run dev
```

## Build phases

- **Phase 0** — scaffold, theme tokens, starfield, hello-world deploy (done)
- **Phase 1** — Supabase data + auth
- **Phase 2** — core editing (ported from the prototype)
- **Phase 3** — spatial UI (field, camera, depth/parallax)
- **Phase 4** — real objects + audio
- **Phase 5** — polish + custom domain
