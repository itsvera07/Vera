import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { headers as getHeaders } from 'next/headers'
import { getPayloadClient } from '@/lib/payload'

export async function POST(request: Request) {
  const payload = await getPayloadClient()
  const { user } = await payload.auth({ headers: await getHeaders() })
  if (!user) {
    return NextResponse.json({ error: 'Please log in first.' }, { status: 401 })
  }

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, amount } = await request.json()

  const keySecret = process.env.RAZORPAY_KEY_SECRET
  if (!keySecret) {
    return NextResponse.json({ error: 'Payments are not configured yet.' }, { status: 500 })
  }

  // This signature check is what proves the payment actually happened and
  // wasn't just a browser calling this endpoint directly with made-up IDs.
  // Razorpay docs: https://razorpay.com/docs/payments/server-integration/nodejs/payment-gateway/build-integration/#step-5-verify-payment-signature
  const expectedSignature = crypto
    .createHmac('sha256', keySecret)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex')

  if (expectedSignature !== razorpay_signature) {
    return NextResponse.json({ error: 'Payment verification failed.' }, { status: 400 })
  }

  // Idempotency: if this payment was already credited (e.g. the webhook got
  // there first), don't double-credit the wallet.
  const existing = await payload.find({
    collection: 'wallet-transactions',
    where: { razorpayPaymentId: { equals: razorpay_payment_id } },
    limit: 1,
  })
  if (existing.docs.length > 0) {
    return NextResponse.json({ ok: true, alreadyCredited: true })
  }

  const rupees = Math.round(Number(amount) / 100)

  await payload.create({
    collection: 'wallet-transactions',
    data: {
      user: user.id,
      type: 'topup',
      amount: rupees,
      razorpayPaymentId: razorpay_payment_id,
      note: 'Wallet top-up via Razorpay',
    },
  })

  const freshUser = await payload.findByID({ collection: 'users', id: user.id })
  await payload.update({
    collection: 'users',
    id: user.id,
    data: { walletBalance: (freshUser.walletBalance ?? 0) + rupees },
  })

  return NextResponse.json({ ok: true })
}
