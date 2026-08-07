import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { getPayloadClient } from '@/lib/payload'

export async function POST(request: Request) {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET
  const rawBody = await request.text()

  if (webhookSecret) {
    const signature = request.headers.get('x-razorpay-signature') ?? ''
    const expected = crypto.createHmac('sha256', webhookSecret).update(rawBody).digest('hex')
    if (signature !== expected) {
      return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 400 })
    }
  }

  const event = JSON.parse(rawBody)
  if (event.event !== 'payment.captured') {
    // We only care about successful payments — acknowledge everything else
    // so Razorpay doesn't keep retrying it.
    return NextResponse.json({ ok: true })
  }

  const payment = event.payload?.payment?.entity
  if (!payment) return NextResponse.json({ ok: true })

  const payload = await getPayloadClient()

  const existing = await payload.find({
    collection: 'wallet-transactions',
    where: { razorpayPaymentId: { equals: payment.id } },
    limit: 1,
  })
  if (existing.docs.length > 0) {
    return NextResponse.json({ ok: true, alreadyCredited: true })
  }

  // The order's notes.userId (set when we created the order) is how we know
  // whose wallet to credit — webhooks arrive with no browser session.
  const keyId = process.env.RAZORPAY_KEY_ID
  const keySecret = process.env.RAZORPAY_KEY_SECRET
  const orderRes = await fetch(`https://api.razorpay.com/v1/orders/${payment.order_id}`, {
    headers: { Authorization: 'Basic ' + Buffer.from(`${keyId}:${keySecret}`).toString('base64') },
  })
  const order = await orderRes.json()
  const userId = order?.notes?.userId
  if (!userId) return NextResponse.json({ ok: true })

  const rupees = Math.round(payment.amount / 100)

  await payload.create({
    collection: 'wallet-transactions',
    data: {
      user: userId,
      type: 'topup',
      amount: rupees,
      razorpayPaymentId: payment.id,
      note: 'Wallet top-up via Razorpay (webhook)',
    },
  })

  const user = await payload.findByID({ collection: 'users', id: userId })
  await payload.update({
    collection: 'users',
    id: userId,
    data: { walletBalance: (user.walletBalance ?? 0) + rupees },
  })

  return NextResponse.json({ ok: true })
}
