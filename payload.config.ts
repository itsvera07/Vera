import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { s3Storage } from "@payloadcms/storage-s3";
import { buildConfig } from "payload";
import path from "path";
import { fileURLToPath } from "url";

import { Users } from "./src/collections/Users";
import { Media } from "./src/collections/Media";
import { Topics } from "./src/collections/Topics";
import { Modules } from "./src/collections/Modules";
import { Lessons } from "./src/collections/Lessons";
import { StoryThemes, Books, Chapters } from "./src/collections/Stories";
import { ChatThemes, Chats } from "./src/collections/ChatLibrary";
import { WalletTransactions, Purchases } from "./src/collections/Wallet";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

// Every domain this app is actually served from — Payload needs this exact
// list to trust cookie-based login/signup requests. Missing this is a very
// common cause of "login just doesn't work" on a freshly deployed site,
// since localhost worked fine without it (same-origin dev server) but a
// real domain needs to be explicitly allowlisted.
const allowedOrigins = [process.env.NEXT_PUBLIC_SERVER_URL, "http://localhost:3000"].filter((v): v is string => Boolean(v));

export default buildConfig({
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: "- Vera CMS",
    },
  },
  cors: allowedOrigins,
  csrf: allowedOrigins,
  editor: lexicalEditor({}),
  collections: [Users, Media, Topics, Modules, Lessons, StoryThemes, Books, Chapters, ChatThemes, Chats, WalletTransactions, Purchases],
  secret: process.env.PAYLOAD_SECRET || "",
  typescript: {
    outputFile: path.resolve(dirname, "src/payload-types.ts"),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || "",
      max: 10,
      idleTimeoutMillis: 10000,
      // Neon's free tier can suspend its compute after inactivity and take
      // a few seconds to wake back up on the next request — 10s was too
      // tight and could fail on a cold start. 20s gives real headroom.
      connectionTimeoutMillis: 20000,
    },
  }),
  plugins: [
    // Supabase Storage speaks the S3 API, so Payload's official S3 adapter
    // works against it directly — no unofficial/third-party plugin needed.
    // Get these 3 values from Supabase: Project Settings → Data API → S3 Connection.
    s3Storage({
      collections: { media: true },
      bucket: process.env.SUPABASE_STORAGE_BUCKET || "vera-media",
      config: {
        endpoint: process.env.SUPABASE_S3_ENDPOINT, // e.g. https://<project-ref>.supabase.co/storage/v1/s3
        region: process.env.SUPABASE_S3_REGION || "ap-south-1",
        credentials: {
          accessKeyId: process.env.SUPABASE_S3_ACCESS_KEY_ID || "",
          secretAccessKey: process.env.SUPABASE_S3_SECRET_ACCESS_KEY || "",
        },
        forcePathStyle: true,
      },
    }),
  ],
});
