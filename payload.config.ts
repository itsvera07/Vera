import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import { buildConfig } from 'payload'
import path from 'path'
import { fileURLToPath } from 'url'

import { Users } from './src/collections/Users'
import { Media } from './src/collections/Media'
import { Topics } from './src/collections/Topics'
import { Modules } from './src/collections/Modules'
import { Lessons } from './src/collections/Lessons'
import { StoryThemes, Books, Chapters } from './src/collections/Stories'
import { ChatThemes, Chats } from './src/collections/ChatLibrary'
import { WalletTransactions, Purchases } from './src/collections/Wallet'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: '- Vera CMS',
    },
  },
  editor: lexicalEditor({}),
  collections: [
    Users,
    Media,
    Topics,
    Modules,
    Lessons,
    StoryThemes,
    Books,
    Chapters,
    ChatThemes,
    Chats,
    WalletTransactions,
    Purchases,
  ],
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'src/payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
      max: 10,
      idleTimeoutMillis: 10000,
      connectionTimeoutMillis: 10000,
    },
  }),
  plugins: [
    // Supabase Storage speaks the S3 API, so Payload's official S3 adapter
    // works against it directly — no unofficial/third-party plugin needed.
    // Get these 3 values from Supabase: Project Settings → Data API → S3 Connection.
    s3Storage({
      collections: { media: true },
      bucket: process.env.SUPABASE_STORAGE_BUCKET || 'vera-media',
      config: {
        endpoint: process.env.SUPABASE_S3_ENDPOINT, // e.g. https://<project-ref>.supabase.co/storage/v1/s3
        region: process.env.SUPABASE_S3_REGION || 'ap-south-1',
        credentials: {
          accessKeyId: process.env.SUPABASE_S3_ACCESS_KEY_ID || '',
          secretAccessKey: process.env.SUPABASE_S3_SECRET_ACCESS_KEY || '',
        },
        forcePathStyle: true,
      },
    }),
  ],
})
