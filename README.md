# Vera — Phase 1

This is the working foundation of Vera: content model, CMS, and the free
learning flow (Home → Learn → Topic → Module → Lesson), plus Stories and
Chat Library, all wired to a real database instead of hardcoded text. The
wallet/paywall works in a "dev test money" mode so you can try it end to
end before we wire up real payments in Phase 2.

## Why pages might feel slow

Two separate things affect load time, and it's worth knowing which one
you're seeing:

**1. Next.js dev mode compiles each page the first time you visit it.**
That first `Compiling /topics/[slug] ...` you see in the terminal can
genuinely take several seconds — this is normal for `npm run dev` and has
nothing to do with your content or database. It won't happen in
production. To see real-world speed, run:

```bash
npm run build
npm run start
```

**2. Your Neon connection string matters a lot.** In your Neon dashboard,
there are two connection strings: a **direct** one and a **pooled** one
(hostname includes `-pooler`). Make sure `DATABASE_URI` in your `.env`
uses the **pooled** one — the direct connection is meant for one-off
admin/migration tools, not a live web app, and can add real, noticeable
latency to every single page load.

If both of those are already right and pages still feel slow, tell me
which specific page and I'll profile the actual queries it's making.

## What's in here

- **Next.js 15 + React 19 + TypeScript + Tailwind** — the website
- **Payload CMS 3**, running _inside_ the same Next.js app (one project, one
  `npm run dev`, no separate CMS server to manage) — the admin panel where
  you'll upload all content, at `/admin`
- **Neon Postgres** — the database (both content and users live here)
- **Supabase Storage** — where uploaded images/audio/video actually get
  stored (it speaks the same protocol as Amazon S3, so we use Payload's
  official S3 storage adapter pointed at it — no third-party plugin)

Nothing is hardcoded: every topic, module, lesson, chat, story, and price
comes from what you type into `/admin`.

## One-time setup (do this once)

### 1. Install Node.js

Download the **LTS** version from https://nodejs.org and install it
(same as installing any normal app).

### 2. Create your free Neon database

1. Go to https://neon.tech, sign up, create a project called "vera".
2. On the project dashboard, copy the **connection string** (starts with
   `postgresql://...`).

### 3. Create your free Supabase Storage bucket

1. Go to https://supabase.com, sign up, create a project called "vera".
2. In the left sidebar, go to **Storage → New bucket**, name it `vera-media`,
   and make it **public** (so images/audio can load on the website).
3. Go to **Project Settings → Data API → S3 Connection** and copy the
   endpoint URL and region.
4. Go to **Project Settings → API → Service Role** (or create a dedicated
   S3 access key under Storage settings) to get an access key ID and
   secret access key.

### 4. Create your free Razorpay account (for wallet top-ups)

1. Go to https://dashboard.razorpay.com/signup and create an account.
2. You'll start in **Test Mode** (toggle top-right) — stay there until
   you're ready for real payments. Test mode uses fake cards, no real money.
3. Go to **Settings → API Keys → Generate Test Key**. Copy the Key ID and
   Key Secret.
4. To test a payment later, use Razorpay's test card `4111 1111 1111 1111`,
   any future expiry date, any CVV. Full list of test options:
   https://razorpay.com/docs/payments/payments/test-card-upi-details/
5. (Optional, do this once you're deployed to a real domain, not
   localhost) Go to **Settings → Webhooks → Add New Webhook**, set the URL
   to `https://yourdomain.com/api/custom/razorpay-webhook`, select the
   `payment.captured` event, and paste the webhook secret it gives you
   into `.env` as `RAZORPAY_WEBHOOK_SECRET`. This is a safety net — wallets
   get credited correctly without it too, this just covers the rare case
   where someone closes their browser tab right after paying.

### 5. Configure your `.env` file

1. In this folder, make a copy of `.env.example` and rename it to `.env`.
2. Paste in:
   - `DATABASE_URI` → the Neon connection string from step 2
   - `PAYLOAD_SECRET` → any long random sentence, e.g. `correct-horse-battery-staple-vera-2026`
   - `SUPABASE_STORAGE_BUCKET`, `SUPABASE_S3_ENDPOINT`, `SUPABASE_S3_REGION`,
     `SUPABASE_S3_ACCESS_KEY_ID`, `SUPABASE_S3_SECRET_ACCESS_KEY` → from step 3
   - `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET` → from step 4

### 6. Install and run

Open a terminal in this folder and run:

```bash
npm install
npm run dev
```

Leave that running, then:

- Visit **http://localhost:3000/admin** — Payload will ask you to create
  the first admin user (this is your login, not a public account).
- Visit **http://localhost:3000** — the actual website. It'll look empty
  at first (no content yet).

### 7. Generate Payload's import map

This is a one-time step that wires up admin panel components (like the
file upload button):

```bash
npm run generate:importmap
```

Restart `npm run dev` after this and the "PayloadComponent not found in
importMap" message will be gone.

### 8. Load sample content (optional but recommended)

This fills in the exact "Talking in School" example from your Figma
mockups, so you can see the whole free-lesson → paywall flow working
immediately:

```bash
npm run seed
```

Then refresh http://localhost:3000 — you'll see it populated.

## Adding your real content

Go to **/admin** and you'll see collections on the left: Topics, Modules,
Lessons, Story Themes, Books, Chapters, Chat Themes, Chats. The order is:

1. Create a **Topic** (e.g. "Professional Communication")
2. Create **Modules** inside it, each pointing back to that Topic
3. Create **Lessons** inside each Module — this is where you add content
   blocks (Introduction, Learn the Concept, Real Conversation, etc.) and
   drag them into whatever order you want
4. Set `freeLessonCount` and `unlockPrice` on the Topic — that alone
   controls which lessons show free and which show the paywall, across
   the whole topic, automatically

Stories and Chat Library follow the same pattern (Theme → Book → Chapter,
and Theme → Chat).

## Testing login and the wallet right now

1. Go to `/signup` and create a real account (this is a real user in your
   `users` collection, visible in `/admin`)
2. Go to **My Space → Top up wallet**, pick an amount, and pay with
   Razorpay's test card `4111 1111 1111 1111` (any future expiry, any CVV)
3. Your wallet balance updates immediately, and the top-up is recorded in
   the `wallet-transactions` collection in `/admin`
4. Go to a locked lesson/chapter and unlock it — same real spend logic as
   before, just backed by a real payment now instead of dev-money

There's also still a `devAddFunds` server action in `src/lib/actions.ts`
(disabled outside dev mode) if you ever want to add test wallet balance
without going through Razorpay's checkout — it's just not wired to any
button anymore since real payments work now.

## What's built vs. what's next

**Built (Phase 1 — content & structure):**

- Full content model in Payload (Topics/Modules/Lessons, Stories, Chat
  Library, Users with wallet + progress)
- Home, Learn, Topic, Module, Lesson, Stories, Book, Chapter, Chat
  Library, My Space pages, all reading live from the CMS
- Progress tracking (mark lesson complete, resume)
- Per-topic color theming, real icons, responsive desktop layout, motion

**Built (Phase 2 — accounts & real payments):**

- `/signup` and `/login` pages, using Payload's own auth (real accounts,
  real sessions via HttpOnly cookie — nothing custom-built that could
  drift from Payload's security practices)
- Real logout, wired into My Space
- Real Razorpay wallet top-ups: `/api/custom/wallet/create-order` starts a
  payment, `/api/custom/wallet/verify` confirms it (signature-checked) and
  credits the wallet, `/api/custom/razorpay-webhook` is a server-to-server
  backup so a payment still gets credited even if someone closes the tab
  right after paying
- Paywall unlock logic now spends from a wallet balance that's backed by
  real money

**Not built yet:**

- Search (the search bars on Home/Learn/Stories/Chat are still visual only)
- "Read the full chat" links from a Lesson into its matching Chat Library
  entry
- Weekly-chapter release automation/notifications
- Real Account Settings / Notifications / Manage Subscription pages (the
  buttons exist in My Space but don't do anything yet — only Log Out is
  wired up)
- Password reset flow
- Admin niceties like a content preview button

## Deploying

This app can deploy as a single Next.js app (Payload runs inside it, no
separate server needed):

- **Netlify**: connect this repo, it'll pick up `netlify.toml`
  automatically. Add the same environment variables from your `.env` in
  Netlify's dashboard (Site settings → Environment variables).
- Your Neon database and Cloudinary account work the same in production
  as local — just make sure `NEXT_PUBLIC_SERVER_URL` is set to your real
  domain once you have one.

If you ever hit trouble with Payload's admin panel specifically on
Netlify (heavier admin operations sometimes want a persistent server),
Railway or Render are easy drop-in alternatives for hosting this exact
same codebase — no code changes needed, just a different host.
