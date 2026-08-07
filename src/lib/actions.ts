'use server'

import { getPayloadClient } from './payload'
import { headers as getHeaders } from 'next/headers'
import { revalidatePath } from 'next/cache'

async function getCurrentUser() {
  const payload = await getPayloadClient()
  const headers = await getHeaders()
  const { user } = await payload.auth({ headers })
  return user
}

export async function unlockTopic(topicId: string | number) {
  const payload = await getPayloadClient()
  const user = await getCurrentUser()
  if (!user) return { ok: false, error: 'Please log in first.' }

  const topic = await payload.findByID({ collection: 'topics', id: topicId })
  if (!topic) return { ok: false, error: 'Topic not found.' }

  const alreadyUnlocked = (user.unlockedTopics ?? []).some(
    (t: any) => (typeof t === 'string' ? t : t.id) === topicId,
  )
  if (alreadyUnlocked) return { ok: true }

  if ((user.walletBalance ?? 0) < topic.unlockPrice) {
    return { ok: false, error: 'Not enough wallet balance. Please top up.' }
  }

  const newBalance = (user.walletBalance ?? 0) - topic.unlockPrice

  await payload.create({
    collection: 'wallet-transactions',
    data: {
      user: user.id,
      type: 'spend',
      amount: -topic.unlockPrice,
      note: `Unlocked topic: ${topic.title}`,
    },
  })

  await payload.create({
    collection: 'purchases',
    data: { user: user.id, itemType: 'topic', topic: topic.id, pricePaid: topic.unlockPrice },
  })

  const existingTopicIds = (user.unlockedTopics ?? []).map((t: any) => (typeof t === 'string' ? t : t.id))

  await payload.update({
    collection: 'users',
    id: user.id,
    data: {
      walletBalance: newBalance,
      unlockedTopics: [...existingTopicIds, topic.id],
    },
  })

  revalidatePath('/topics/[slug]', 'page')
  return { ok: true }
}

export async function unlockBook(bookId: string | number) {
  const payload = await getPayloadClient()
  const user = await getCurrentUser()
  if (!user) return { ok: false, error: 'Please log in first.' }

  const book = await payload.findByID({ collection: 'books', id: bookId })
  if (!book) return { ok: false, error: 'Book not found.' }

  const alreadyUnlocked = (user.unlockedBooks ?? []).some(
    (b: any) => (typeof b === 'string' ? b : b.id) === bookId,
  )
  if (alreadyUnlocked) return { ok: true }

  if ((user.walletBalance ?? 0) < book.unlockPrice) {
    return { ok: false, error: 'Not enough wallet balance. Please top up.' }
  }

  const newBalance = (user.walletBalance ?? 0) - book.unlockPrice

  await payload.create({
    collection: 'wallet-transactions',
    data: { user: user.id, type: 'spend', amount: -book.unlockPrice, note: `Unlocked book: ${book.title}` },
  })

  await payload.create({
    collection: 'purchases',
    data: { user: user.id, itemType: 'book', book: book.id, pricePaid: book.unlockPrice },
  })

  const existingBookIds = (user.unlockedBooks ?? []).map((b: any) => (typeof b === 'string' ? b : b.id))

  await payload.update({
    collection: 'users',
    id: user.id,
    data: { walletBalance: newBalance, unlockedBooks: [...existingBookIds, book.id] },
  })

  revalidatePath('/stories/[bookSlug]', 'page')
  return { ok: true }
}

export async function markLessonComplete(lessonId: string | number) {
  const payload = await getPayloadClient()
  const user = await getCurrentUser()
  if (!user) return { ok: false, error: 'Please log in first.' }

  const progress = [...(user.lessonProgress ?? [])]
  const existingIndex = progress.findIndex(
    (p: any) => (typeof p.lesson === 'string' ? p.lesson : p.lesson?.id) === lessonId,
  )

  if (existingIndex >= 0) {
    progress[existingIndex] = { ...progress[existingIndex], completed: true, lastOpenedAt: new Date().toISOString() }
  } else {
    progress.push({ lesson: lessonId, completed: true, lastOpenedAt: new Date().toISOString() })
  }

  await payload.update({ collection: 'users', id: user.id, data: { lessonProgress: progress } })
  revalidatePath('/topics/[slug]/[moduleSlug]/[lessonSlug]', 'page')
  return { ok: true }
}

/**
 * DEV-ONLY top-up so you can test the paywall before Razorpay is wired up.
 * Phase 2 replaces this with a real Razorpay order + webhook that calls the
 * same wallet-transactions/users update logic after payment is confirmed.
 */
export async function devAddFunds(amount: number) {
  if (process.env.NODE_ENV === 'production') {
    return { ok: false, error: 'Dev top-up is disabled in production.' }
  }
  const payload = await getPayloadClient()
  const user = await getCurrentUser()
  if (!user) return { ok: false, error: 'Please log in first.' }

  await payload.create({
    collection: 'wallet-transactions',
    data: { user: user.id, type: 'topup', amount, note: 'Dev test top-up' },
  })

  await payload.update({
    collection: 'users',
    id: user.id,
    data: { walletBalance: (user.walletBalance ?? 0) + amount },
  })

  revalidatePath('/my-space')
  return { ok: true }
}
