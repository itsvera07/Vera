import { getPayload } from 'payload'
import config from '../../payload.config'

// Cached across requests in dev/prod — this is the recommended Payload 3
// pattern for reading CMS content from React Server Components without an
// extra network hop.
let cached: ReturnType<typeof getPayload> | null = null

export function getPayloadClient() {
  if (!cached) {
    cached = getPayload({ config })
  }
  return cached
}
