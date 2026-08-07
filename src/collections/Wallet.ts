import type { CollectionConfig } from 'payload'

// Every top-up and every spend creates one row here — an immutable ledger,
// never edited or deleted, so the wallet balance can always be audited/
// reconstructed. walletBalance on the User is a cached total for speed.
export const WalletTransactions: CollectionConfig = {
  slug: 'wallet-transactions',
  admin: { useAsTitle: 'id', defaultColumns: ['user', 'type', 'amount', 'createdAt'] },
  access: {
    read: ({ req }) => Boolean(req.user),
    create: () => false, // only created by server-side logic (Razorpay webhook / unlock action), never directly
    update: () => false,
    delete: () => false,
  },
  fields: [
    { name: 'user', type: 'relationship', relationTo: 'users', required: true },
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        { label: 'Top-up (money in via Razorpay)', value: 'topup' },
        { label: 'Spend (unlocked content)', value: 'spend' },
        { label: 'Refund', value: 'refund' },
      ],
    },
    { name: 'amount', type: 'number', required: true, admin: { description: 'In ₹. Positive for top-up/refund, negative for spend.' } },
    { name: 'razorpayPaymentId', type: 'text', admin: { description: 'Set only for topup rows' } },
    { name: 'note', type: 'text', admin: { description: 'e.g. "Unlocked Talking in School bundle"' } },
  ],
}

export const Purchases: CollectionConfig = {
  slug: 'purchases',
  admin: { useAsTitle: 'id', defaultColumns: ['user', 'itemType', 'createdAt'] },
  access: {
    read: ({ req }) => Boolean(req.user),
    create: () => false,
    update: () => false,
    delete: () => false,
  },
  fields: [
    { name: 'user', type: 'relationship', relationTo: 'users', required: true },
    {
      name: 'itemType',
      type: 'select',
      required: true,
      options: [
        { label: 'Topic bundle', value: 'topic' },
        { label: 'Book', value: 'book' },
      ],
    },
    { name: 'topic', type: 'relationship', relationTo: 'topics' },
    { name: 'book', type: 'relationship', relationTo: 'books' },
    { name: 'pricePaid', type: 'number', required: true },
  ],
}
