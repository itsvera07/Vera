import { NextResponse } from 'next/server'
import { headers as getHeaders } from 'next/headers'
import { getPayloadClient } from '@/lib/payload'

export async function POST(request: Request) {
  const payload = await getPayloadClient()
  const { user } = await payload.auth({ headers: await getHeaders() })
  if (!user) {
    return NextResponse.json({ error: 'Please log in first.' }, { status: 401 })
  }

  const { amount } = await request.json()
  const rupees = Number(amount)
  if (!rupees || rupees < 1 || rupees > 5000) {
    return NextResponse.json({ error: 'Enter an amount between ₹1 and ₹5000.' }, { status: 400 })
  }

  const keyId = process.env.RAZORPAY_KEY_ID
  const keySecret = process.env.RAZORPAY_KEY_SECRET
  if (!keyId || !keySecret) {
    return NextResponse.json(
      { error: 'Payments are not configured yet. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to .env.' },
      { status: 500 },
    )
  }

  // Razorpay's Orders API — called directly over fetch with Basic Auth so we
  // don't need an extra SDK dependency. Docs: https://razorpay.com/docs/api/orders/create/
  const razorpayRes = await fetch('https://api.razorpay.com/v1/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Basic ' + Buffer.from(`${keyId}:${keySecret}`).toString('base64'),
    },
    body: JSON.stringify({
      amount: Math.round(rupees * 100), // Razorpay wants paise, not rupees
      currency: 'INR',
      // notes.userId lets the webhook (which has no browser session) know
      // whose wallet to credit when Razorpay calls us back server-to-server.
      notes: { userId: String(user.id) },
    }),
  })

  if (!razorpayRes.ok) {
    const errText = await razorpayRes.text()
    console.error('Razorpay order creation failed:', errText)
    return NextResponse.json({ error: 'Could not start payment. Please try again.' }, { status: 502 })
  }

  const order = await razorpayRes.json()

  return NextResponse.json({
    orderId: order.id,
    amount: order.amount,
    currency: order.currency,
    keyId,
  })
}
