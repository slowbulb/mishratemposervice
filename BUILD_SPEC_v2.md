# Concept Album App — v2 Build Spec (Claude Code Handoff)

This is the plan to take the existing single-file prototype (`concept-album-storyboard.html`,
described fully in `PROJECT_BRIEF.md`) into a real full-stack web app: Supabase backend,
multi-album support, and an immersive 2.5D spatial UI where tracks are everyday objects
(an auto-rickshaw, a chai cup, etc.) drifting through space.

Read `PROJECT_BRIEF.md` first — it documents every feature, the data shape, and the known
issues of the working prototype. This spec builds ON that; it does not replace the concept,
only the implementation.

---

## 0. Decisions locked (override in session 1 if wrong)

These are the defaults chosen from the owner's answers so far. Confirm at the start; changing
any of them is cheap if done before schema work begins.

- **Auth model: single owner.** One account (the owner) can edit. Everyone else gets a
  public, read-only view. No public signup. (If bandmates need edit access later, it becomes
  "invited collaborators" — a small change to the RLS policy, noted in §4.)
- **Albums: multiple.** The app holds several albums; the owner can create/switch/delete.
  Public visitors see a chosen "published" album (or a list).
- **Audio: deferred to Phase 4.** Build lyrics + sequencing + spatial UI first. Audio upload
  to Supabase Storage comes after the core app is solid. (Rationale in PROJECT_BRIEF roadmap:
  audio is the heavy, costly part; prove the app first.)
- **Design direction: 2.5D parallax field, NOT full WebGL flythrough for v1.** Objects are
  layered illustrations/SVG that drift, tilt, and parallax to *feel* like flying through a
  space of floating tracks. True Three.js/R3F 3D is a v2+ upgrade the layout is designed to
  accommodate, not require.

---

## 1. Stack

- **Framework:** React + Vite + TypeScript. (Vite for fast dev/HMR — essential for tuning motion live.)
- **Routing:** React Router. Routes: `/` (public field view), `/album/:id` (public album),
  `/edit` (owner, gated by auth), `/login`.
- **Motion:** Framer Motion (the *library*, not the Framer builder) for element motion,
  layout transitions, and gestures. Add GSAP + ScrollTrigger only if scroll-driven sequences
  are wanted beyond what Framer Motion covers.
- **3D (deferred):** React Three Fiber + drei, introduced only when moving an object from
  2.5D sprite to real 3D model. Keep the scene abstraction (§5) engine-agnostic so this swap
  is localized.
- **Backend:** Supabase — Postgres (data), Auth (owner login), Storage (audio, Phase 4).
- **Client lib:** `@supabase/supabase-js`.
- **Deploy:** Vercel or Cloudflare Pages (both free tier, connect the GitHub repo, auto-deploy
  on push). Supabase keys via environment variables.
- **State:** React Query (TanStack Query) for server state (albums, tracks) — handles caching,
  optimistic updates, refetch. Local UI state (drag, camera position, lock) in component state
  or Zustand if it grows.

Keep it a real project in git from commit 1. Push to GitHub before wiring Supabase.

---

## 2. What carries over from the prototype

The prototype's *logic* is proven and should be ported, not reinvented:

- **Data model** (extend, don't discard): track = `{ id, title, prose }`; album has title +
  artist; sequence slots A/B/C/D as arrays of track ids. See §3 for the DB version.
- **Reordering semantics:** drag-to-reorder + up/down nudge; running order = story order;
  track numbers and SIDE A/B reflow automatically.
- **Sequence slots A/B/C/D:** A/B are preset orders, C/D are user-saved. Port as a per-album
  feature (each album has its own slots).
- **Copy outline / Export liner notes:** keep both. Liner notes especially — it's the natural
  public read-only artifact; the public route can BE a liner-notes-style view.
- **View/edit lock:** the prototype's front-end lock becomes REAL here — replaced by Supabase
  auth. Locked = not logged in = read-only (server-enforced). Unlock = login.
- **Space theme tokens:** the CSS variables (deep space #050512 / #0C1030, star-gold #F2C94C,
  comet teal #7FD1E8, violet nebula, glass panels), fonts (Instrument Serif / Instrument Sans /
  IBM Plex Mono), and starfield are the visual foundation. Carry them into the design system.
- **The lyrics content** (six tracks, working titles, bracketed draft notes, invented words) —
  seed the owner's first album with these. Do NOT "correct" lyric content.

Known issues from the prototype to fix in the port (don't re-inherit): id regeneration on
import breaking sequences; autosave-vs-defaults conflicts; no undo; no delete confirm.

---

## 3. Database schema (Supabase / Postgres)

```sql
-- albums
create table albums (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references auth.users not null,
  title text not null default 'Untitled',
  artist text default '',
  published boolean not null default false,   -- shows on public site when true
  slots jsonb not null default '{"A":null,"B":null,"C":null,"D":null}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- tracks
create table tracks (
  id uuid primary key default gen_random_uuid(),
  album_id uuid references albums(id) on delete cascade not null,
  title text default '',
  prose text default '',
  position int not null,                       -- running order; the story order
  object_key text,                             -- which scene object represents this track (see §5)
  audio_path text,                             -- Storage path, Phase 4
  created_at timestamptz default now()
);

create index tracks_album_position on tracks(album_id, position);
```

Notes:
- `position` (int) replaces array-of-ids ordering for tracks — cleaner for DB reorder. On
  drag, update affected rows' positions. Keep a helper that renumbers 0..n after any move.
- `slots` stays JSONB but stores arrays of **track ids** as before. Because track ids are now
  stable DB uuids (not regenerated), the prototype's "load breaks sequences" bug disappears.
- `object_key` links a track to its visual object in the scene registry (§5), e.g.
  `"rickshaw"`, `"chai_cup"`, `"failing_trampoline"`.

---

## 4. Auth + security (the part that makes the password REAL)

The whole point of going server-side: writes are enforced by the database, not by hidden JS.
Row-Level Security (RLS) does this.

```sql
alter table albums enable row level security;
alter table tracks enable row level security;

-- PUBLIC READ: anyone may read published albums and their tracks
create policy "public reads published albums"
  on albums for select using (published = true);
create policy "public reads tracks of published albums"
  on tracks for select using (
    exists (select 1 from albums a where a.id = tracks.album_id and a.published = true)
  );

-- OWNER FULL ACCESS: the logged-in owner may do anything to their own rows
create policy "owner all on albums"
  on albums for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);
create policy "owner all on tracks"
  on tracks for all using (
    exists (select 1 from albums a where a.id = tracks.album_id and a.owner_id = auth.uid())
  ) with check (
    exists (select 1 from albums a where a.id = tracks.album_id and a.owner_id = auth.uid())
  );
```

- **Single-owner model:** owner logs in via Supabase Auth (email magic link is simplest; email+
  password also fine). The `anon` public key is safe to ship in the client — RLS is what protects
  data. NEVER ship the `service_role` key to the browser.
- **Bandmate/collaborator upgrade (later):** add a `collaborators` table (album_id, user_id) and
  widen the owner policies to `owner_id = auth.uid() OR exists(collaborator row)`. Localized change.
- This is the classic Supabase footgun: **if RLS is left off, the public anon key can read/write
  everything.** Verify RLS is ON for both tables and test as a logged-out user before shipping.

### Owner setup steps (human-only — Claude Code guides, owner executes)
1. Create a Supabase project at supabase.com (free tier).
2. Run the schema + RLS SQL above in the SQL editor.
3. Auth settings: enable Email provider; add the deploy URL + localhost to redirect allowlist.
4. Copy Project URL and `anon` public key into the app's `.env` (`VITE_SUPABASE_URL`,
   `VITE_SUPABASE_ANON_KEY`). Never commit `.env`.
5. Create the owner account (sign up once); optionally note its user id.
6. Later (Phase 4): create a Storage bucket `audio`, add read/write policies mirroring the table
   RLS.

---

## 5. The spatial UI — architecture

The core interaction: tracks are objects floating in a deep-space field; navigating moves you
through the field. Built 2.5D (layered DOM + CSS 3D transforms + Framer Motion), designed so a
later swap to real 3D (R3F) touches only the renderer, not the data or layout logic.

### Scene model
- A **field** with a virtual "camera" position (x, y, and a depth/zoom scalar). Public view:
  camera drifts / responds to scroll or pointer. Edit view: same field, plus editing affordances.
- Each track = a **node** placed at a position in field space with a **depth** value. Depth drives
  scale, blur, opacity, and parallax rate (near = bigger/sharper/faster; far = smaller/hazier/slower).
- Reordering = repositioning nodes along the field's main path (the "flight path"). The running
  order threads through space as a route the camera can travel. Track number rings sit on each node.
- A faint **dotted flight-path line** connects nodes in order (this was floated as a nice-to-have;
  here it becomes the literal spine of the story — the route through the album).

### Object registry (§ ties to `tracks.object_key`)
A registry maps `object_key` → a component that renders that object. Each object is a **parallax
rig**: a small set of layers (e.g. body / near wheel / far wheel / canopy / glow / trail) that move
at slightly different rates for depth, plus idle motion (bob, tilt, spin, drift).

```
objects/
  Rickshaw.tsx        // reference object — see §6
  ChaiCup.tsx
  FailingTrampoline.tsx
  Placeholder.tsx     // simple glowing shape; used until real art exists
  registry.ts         // { rickshaw: Rickshaw, chai_cup: ChaiCup, ... , _default: Placeholder }
```

Build the field with `Placeholder` for every node FIRST. Get motion, depth, reorder, and camera
feeling right with placeholders. Only then replace individual objects with real art. Rationale:
an object only reads correctly in context (its motion, scale, lighting, neighbors) — designing art
in isolation before the field exists wastes effort.

### Motion principles
- Everything eases; nothing snaps. Reorder animates positions (Framer Motion layout).
- Respect `prefers-reduced-motion`: disable idle drift/parallax, keep static depth layout.
- Performance: cap layer counts, use transform/opacity only (GPU-friendly), lazy-mount off-screen
  nodes. Must stay smooth on a mid phone.

---

## 6. Object design language (how the objects themselves are made)

The album's soul is the collision of the mundane-everyday and the cosmic: ordinary objects
marooned in space. Design rule: **keep the object honest and recognizable; make only the context
alien.** A real auto-rickshaw that got lost above the atmosphere — not a sleek sci-fi vehicle.

### Reference object: the flying auto-rickshaw
- **Silhouette must stay true:** the iconic three-wheeled shape, tin body, canopy, open sides.
  Recognizably *an auto*. Worn yellow-and-black livery. Optional "Horn OK Please" on the back.
- **Alien only in the details:** trails **stardust** instead of exhaust; headlight is a small
  **star**; the fare meter reads in **light-years**; a tiny dashboard **deity idol glows**.
- **Ties to the lyrics:** this is the "Ghar Chalo!" object — the homesick U-turn, engine on fire.
  The burning-engine motif can live here (a flicker of flame at the back) linking song to object.

### Production route for v1 — layered SVG sprite
- Preferred format: **layered SVG** (crisp at any scale; each part animatable). Fallback: PNG with
  transparency, sliced into layers.
- Layer breakdown (each a separate element in the parallax rig): far wheel, body, near wheel,
  canopy, headlight-star (glow), stardust trail (particle/repeated element), ground-glow.
- Animations: wheels rotate; body bobs + slight tilt on turns; trail streams and fades; headlight
  and idol pulse; whole rig parallaxes by depth.
- **Sourcing the art:** (a) commission an illustrator for a layered SVG in the album's palette;
  (b) draw it directly as SVG paths for a graphic/geometric look (most animatable, sharpest);
  (c) AI-generate a base then clean up + separate layers (fastest to explore, fiddly for clean
  transparency/layers). Whichever: deliver as separable layers, not one flat image.

### Other objects (same technique)
Each track gets an everyday-object-in-space: e.g. a **chai cup** (steam becomes a nebula), a
**failing trampoline over a sea**, a **frozen radio**, a **cigarette** adrift. Same parallax-rig +
idle-motion pattern. Coherent grammar: humble objects, cosmic setting. Assign via `object_key`.

### v2 upgrade path (real 3D)
When an object should be orbitable with real light response: model it as a `.glb` (commission,
buy on Sketchfab/TurboSquid ~$10–40, or build in Blender), render via R3F inside the same node
slot. The registry + node abstraction means only that object's component changes.

---

## 7. Build phases (suggested order for the Claude Code sessions)

**Phase 0 — Scaffold.** Vite+React+TS project, git, GitHub, deploy a hello-world to Vercel.
Port the space-theme tokens + fonts + starfield into a base layout/design system.

**Phase 1 — Data + auth (Supabase).** Wire supabase-js; schema + RLS (§3–4); owner login at
`/login`; React Query hooks for albums/tracks. Seed the owner's first album with the six real
tracks. Verify public (logged-out) read-only vs owner read-write against RLS.

**Phase 2 — Core editing, ported.** Album list + create/switch/delete; track CRUD; drag-reorder
(position renumber) + nudge; sequence slots A/B/C/D per album; copy outline; export liner notes;
publish toggle. This reaches feature-parity with the prototype, now multi-album and server-backed.
Fix the prototype's known issues (stable ids, delete confirm, basic undo).

**Phase 3 — Spatial UI.** The field, camera, nodes, depth/parallax, flight-path line, using
`Placeholder` objects. Public `/` = fly-through read-only experience; `/edit` = same field with
editing. Tune motion live. Reduced-motion + mobile performance passes.

**Phase 4 — Objects + audio.** Replace placeholders with real layered-SVG objects starting with
the rickshaw (§6). Then audio: Storage bucket + policies, per-track upload (owner) and playback
(public), the file/URL dual approach from the roadmap. IndexedDB not needed once Storage exists.

**Phase 5 — Polish.** Custom domain, favicon/meta/share cards, loading/empty states, error
handling, analytics if wanted, optional PWA/install.

---

## 8. Guardrails / conventions

- RLS ON and tested before any public deploy. Only the `anon` key in the client. `.env` gitignored.
- Keep the scene renderer abstracted from data so the 2.5D→3D swap stays localized.
- transform/opacity-only animation; respect reduced-motion everywhere; test on a real phone.
- Preserve the lyric content verbatim (draft artifacts included) — never auto-correct it.
- Optimistic UI for edits (React Query) but reconcile with server; never lose the owner's text.
- Don't let the design drift toward generic-minimal ("Framer default") — the brief is 3D, flowing,
  custom, warm-object-in-cold-space. Motion and the object grammar are the identity.
