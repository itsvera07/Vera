import "dotenv/config";
import { getPayload } from "payload";
import config from "../../payload.config";

// Payload's Lexical rich-text field expects each node to carry version/
// direction/format/indent, not just `type` — this builds a single-paragraph
// value in that exact shape so seeded chapters open correctly in /admin.
function lexicalParagraph(text: string) {
  return {
    root: {
      type: "root",
      version: 1,
      direction: "ltr" as const,
      format: "" as const,
      indent: 0,
      children: [
        {
          type: "paragraph",
          version: 1,
          direction: "ltr" as const,
          format: "" as const,
          indent: 0,
          children: [
            {
              type: "text",
              version: 1,
              text,
              format: 0,
              detail: 0,
              mode: "normal" as const,
              style: "",
            },
          ],
        },
      ],
    },
  };
}

async function seed() {
  const payload = await getPayload({ config });

  console.log("Seeding Vera sample content (matches your Figma mockups)...");

  // ---- Topics ----
  const talkingInSchool = await payload.create({
    collection: "topics",
    data: {
      title: "Talking in School",
      slug: "talking-in-school",
      shortDescription: "Find your voice with classmates, teachers, and new friends — from your first day to your final presentation.",
      icon: "users",
      cardColor: "peach",
      order: 1,
      featured: true,
      freeLessonCount: 3,
      unlockPrice: 9,
    },
  });

  await payload.create({
    collection: "topics",
    data: {
      title: "College & Campus Life",
      slug: "college-campus-life",
      shortDescription: "Navigate hostel life, professors, and campus friendships with confidence.",
      icon: "graduation-cap",
      cardColor: "mint",
      order: 2,
      featured: true,
      freeLessonCount: 3,
      unlockPrice: 9,
    },
  });

  await payload.create({
    collection: "topics",
    data: {
      title: "Love & Relationships",
      shortDescription: "Say what you mean, ask for what you need, and listen better — in every stage of a relationship.",
      slug: "love-relationships",
      icon: "heart",
      cardColor: "pink",
      order: 3,
      featured: true,
      freeLessonCount: 3,
      unlockPrice: 9,
    },
  });

  await payload.create({
    collection: "topics",
    data: {
      title: "Professional Communication",
      slug: "professional-communication",
      shortDescription: "Emails, meetings, and difficult conversations at work, handled well.",
      icon: "briefcase",
      cardColor: "blue",
      order: 4,
      featured: true,
      freeLessonCount: 3,
      unlockPrice: 9,
    },
  });

  await payload.create({
    collection: "topics",
    data: {
      title: "Public Speaking & Confidence",
      slug: "public-speaking-confidence",
      shortDescription: "From shaky voice to steady stage presence.",
      icon: "mic",
      cardColor: "lavender",
      order: 5,
      featured: true,
      freeLessonCount: 3,
      unlockPrice: 9,
    },
  });

  await payload.create({
    collection: "topics",
    data: {
      title: "Learn From Real Chats",
      slug: "learn-from-real-chats",
      shortDescription: "Real conversations, broken down so you can see exactly what worked.",
      icon: "message-circle",
      cardColor: "butter",
      order: 6,
      featured: true,
      freeLessonCount: 3,
      unlockPrice: 9,
    },
  });

  // ---- Modules for Talking in School ----
  const breakingTheIce = await payload.create({
    collection: "modules",
    data: {
      topic: talkingInSchool.id,
      title: "Breaking the Ice",
      slug: "breaking-the-ice",
      shortDescription: "Your first conversations in a new class or new group.",
      order: 1,
      unlockRule: "open",
    },
  });

  const workingWithOthers = await payload.create({
    collection: "modules",
    data: {
      topic: talkingInSchool.id,
      title: "Working with Others",
      slug: "working-with-others",
      shortDescription: "Team up, speak up, and disagree without the awkwardness — the everyday skills of group work.",
      order: 2,
      unlockRule: "sequential",
    },
  });

  await payload.create({
    collection: "modules",
    data: {
      topic: talkingInSchool.id,
      title: "Speaking Up with Confidence",
      slug: "speaking-up-with-confidence",
      shortDescription: "Asking questions and sharing opinions without overthinking it.",
      order: 3,
      unlockRule: "sequential",
    },
  });

  await payload.create({
    collection: "modules",
    data: {
      topic: talkingInSchool.id,
      title: "Presentations & Public Speaking",
      slug: "presentations-public-speaking",
      shortDescription: "Standing in front of the class without freezing up.",
      order: 4,
      unlockRule: "sequential",
    },
  });

  // ---- Lessons for Breaking the Ice (all free — module says "all free") ----
  await payload.create({
    collection: "lessons",
    data: {
      module: breakingTheIce.id,
      title: "How to Start a Conversation with Anyone",
      slug: "how-to-start-a-conversation-with-anyone",
      estimatedMinutes: 3,
      orderInModule: 1,
      orderInTopic: 1,
      content: [
        {
          blockType: "intro",
          body: "Starting a conversation feels harder than it is. This lesson gives you three openers that work almost anywhere.",
        },
        {
          blockType: "concept",
          heading: "Why this matters",
          body: "Most people are just as unsure how to start as you are. Anyone who opens the conversation, wins.",
          points: [
            { title: "Comment on something shared", body: '"This queue is taking forever" works better than "hi".' },
            { title: "Ask an easy, open question", body: '"Have you been here before?" invites more than a yes/no.' },
          ],
        },
      ],
    },
  });

  await payload.create({
    collection: "lessons",
    data: {
      module: breakingTheIce.id,
      title: "Remembering Names (Without the Awkward Ask-Again)",
      slug: "remembering-names",
      estimatedMinutes: 3,
      orderInModule: 2,
      orderInTopic: 2,
      content: [{ blockType: "intro", body: "A simple trick to make names stick the first time." }],
    },
  });

  await payload.create({
    collection: "lessons",
    data: {
      module: breakingTheIce.id,
      title: "Joining a Group Conversation Already in Progress",
      slug: "joining-a-group-conversation",
      estimatedMinutes: 3,
      orderInModule: 3,
      orderInTopic: 3,
      content: [{ blockType: "intro", body: "How to step into a conversation without interrupting it." }],
    },
  });

  await payload.create({
    collection: "lessons",
    data: {
      module: breakingTheIce.id,
      title: "What to Say When You Sit With Someone New",
      slug: "sitting-with-someone-new",
      estimatedMinutes: 4,
      orderInModule: 4,
      orderInTopic: 4, // first PAID lesson — freeLessonCount is 3
      content: [{ blockType: "intro", body: "The exact words for a new lunch table, with none of the small-talk stiffness." }],
    },
  });

  // ---- Lessons for Working with Others (matches the Figma exactly) ----
  await payload.create({
    collection: "lessons",
    data: {
      module: workingWithOthers.id,
      title: "Asking your teacher a question with confidence",
      slug: "asking-your-teacher-a-question",
      estimatedMinutes: 3,
      orderInModule: 1,
      orderInTopic: 5,
      content: [{ blockType: "intro", body: "A simple structure for questions that get a helpful answer, not an awkward pause." }],
    },
  });

  await payload.create({
    collection: "lessons",
    data: {
      module: workingWithOthers.id,
      title: "Working well in group projects",
      slug: "working-well-in-group-projects",
      estimatedMinutes: 5,
      orderInModule: 2,
      orderInTopic: 6,
      content: [
        {
          blockType: "intro",
          body: "Group projects can feel messy — someone always talks too much, someone talks too little, and deadlines sneak up. This lesson gives you three simple habits that make you the person every group actually wants to work with.",
        },
        {
          blockType: "concept",
          heading: "Why this matters",
          body: "Teachers grade the output, but classmates remember how you made the process feel. Being easy to work with is its own kind of skill — and one you can practice on purpose.",
          points: [
            { title: "Say what you're good at, early", body: '"I can handle the research, someone else take slides?" removes guesswork and gets the group moving.' },
            { title: "Check in before you disappear", body: "If you're stuck or behind, a quick heads-up beats going silent until the deadline." },
            { title: "Ask before you assume", body: '"Did you want to present, or would you rather I do it?" avoids stepping on toes.' },
          ],
        },
        {
          blockType: "realConversation",
          heading: "See it in a real chat",
          messages: [
            { text: "I can do the intro slide + research if someone wants to design it", sender: "other" },
            { text: "I'll design it! Can you send rough notes by Thursday?", sender: "self" },
            { text: "Yep, Thursday works 👍", sender: "other" },
          ],
        },
        {
          blockType: "tryToday",
          body: "In your next group task, be the first to say what part you'll take on — even if it's small. Notice how much faster the group moves.",
          buttonLabel: "Mark as tried",
        },
      ],
    },
  });

  await payload.create({
    collection: "lessons",
    data: {
      module: workingWithOthers.id,
      title: "Disagreeing with a classmate, kindly",
      slug: "disagreeing-with-a-classmate-kindly",
      estimatedMinutes: 4,
      orderInModule: 3,
      orderInTopic: 7,
      content: [{ blockType: "intro", body: "Push back on an idea without the conversation turning into a fight." }],
    },
  });

  await payload.create({
    collection: "lessons",
    data: {
      module: workingWithOthers.id,
      title: "Giving feedback without it feeling personal",
      slug: "giving-feedback-without-it-feeling-personal",
      estimatedMinutes: 4,
      orderInModule: 4,
      orderInTopic: 8,
      content: [{ blockType: "intro", body: "A simple structure so feedback lands as helpful, not critical." }],
    },
  });

  // ---- Chat Library ----
  const romanticTheme = await payload.create({
    collection: "chat-themes",
    data: { title: "Romantic", slug: "romantic", icon: "heart", color: "pink", order: 1 },
  });

  await payload.create({
    collection: "chats",
    data: {
      theme: romanticTheme.id,
      title: "Taking things from casual to serious",
      free: true,
      messages: [
        { text: "Hey, you free to talk for a sec?", sender: "self", timestamp: "7:12 PM" },
        { text: "Yeah, you're free tonight? Let's get some coffee?", sender: "other", timestamp: "7:12 PM" },
        { text: "Sure, what's going on?", sender: "self", timestamp: "7:13 PM" },
      ],
    },
  });

  const schoolChatTheme = await payload.create({
    collection: "chat-themes",
    data: { title: "School", slug: "school", icon: "graduation-cap", color: "yellow", order: 4 },
  });

  await payload.create({
    collection: "chats",
    data: {
      theme: schoolChatTheme.id,
      title: "Hey, is that seat taken? I don't really know anyone here honestly",
      free: true,
      messages: [
        { text: "Hey, is that seat taken? I don't really know anyone here, honestly.", sender: "self", timestamp: "1:04 PM" },
        { text: "Not at all — I'm new to this table too, honestly.", sender: "other", timestamp: "1:04 PM" },
        { text: "Haha okay, I thought I was the only one.", sender: "self", timestamp: "1:05 PM" },
      ],
    },
  });

  // ---- Stories ----
  const romanceTheme = await payload.create({
    collection: "story-themes",
    data: { title: "Romance", slug: "romance", description: "Love stories with a communication lesson tucked inside.", order: 1 },
  });

  const theNote = await payload.create({
    collection: "books",
    data: {
      theme: romanceTheme.id,
      title: "The Note",
      slug: "the-note",
      blurb: "A misplaced note starts a conversation neither of them expected.",
      releaseSchedule: "all-at-once",
      freeChapterCount: 2,
      unlockPrice: 9,
    },
  });

  await payload.create({
    collection: "chapters",
    data: {
      book: theNote.id,
      title: "The Note on the Windshield",
      slug: "chapter-1",
      orderInBook: 1,
      body: lexicalParagraph("The note was tucked under the wiper blade, corners flapping in the wind."),
    },
  });

  await payload.create({
    collection: "chapters",
    data: {
      book: theNote.id,
      title: "Reading Between the Lines",
      slug: "chapter-2",
      orderInBook: 2,
      body: lexicalParagraph("She read it twice before she let herself smile."),
    },
  });

  console.log("Done. Visit /admin to see it all, or / for the homepage.");
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
