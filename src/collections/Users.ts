import type { CollectionConfig } from "payload";

export const Users: CollectionConfig = {
  slug: "users",
  auth: true, // Payload's built-in auth — single source of truth, no Auth.js needed
  admin: { useAsTitle: "email" },
  access: {
    read: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    // Payload's real default when this is left unset is "only if already
    // logged in" — which blocks registration by definition, since a new
    // visitor signing up has no session yet. This was the actual cause of
    // signup failing with "You are not allowed to perform this action."
    create: () => true,
  },
  fields: [
    { name: "name", type: "text" },
    {
      name: "walletBalance",
      type: "number",
      defaultValue: 0,
      admin: { description: "In ₹. Only ever changed by server-side wallet logic — never edit by hand except for support fixes.", readOnly: true },
    },
    {
      name: "streakDays",
      type: "number",
      defaultValue: 0,
    },
    {
      name: "unlockedTopics",
      type: "relationship",
      relationTo: "topics",
      hasMany: true,
      admin: { description: "Topics where the paid bundle has been purchased" },
    },
    {
      name: "unlockedBooks",
      type: "relationship",
      relationTo: "books",
      hasMany: true,
    },
    {
      name: "lessonProgress",
      type: "array",
      admin: { description: "One row per lesson the user has opened/completed" },
      fields: [
        { name: "lesson", type: "relationship", relationTo: "lessons", required: true },
        { name: "completed", type: "checkbox", defaultValue: false },
        { name: "lastOpenedAt", type: "date" },
      ],
    },
    {
      name: "savedItems",
      type: "array",
      fields: [
        {
          name: "itemType",
          type: "select",
          options: ["lesson", "book", "chat"],
        },
        { name: "lesson", type: "relationship", relationTo: "lessons" },
        { name: "book", type: "relationship", relationTo: "books" },
        { name: "chat", type: "relationship", relationTo: "chats" },
      ],
    },
    {
      name: "notificationPrefs",
      type: "group",
      admin: { description: "Preferences only for now — no email/push sending is wired up yet, this just stores what the user wants." },
      fields: [
        { name: "dailyReminder", type: "checkbox", defaultValue: true, label: "Daily practice reminder" },
        { name: "weeklyDigest", type: "checkbox", defaultValue: true, label: "Weekly new-content digest" },
        { name: "newChapterAlerts", type: "checkbox", defaultValue: true, label: "New chapter alerts for followed stories" },
      ],
    },
  ],
};
