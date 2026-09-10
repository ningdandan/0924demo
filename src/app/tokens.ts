import learnerSophia from "../imports/students/learner-sophia.png";
import learnerNoah from "../imports/students/learner-noah.png";
import learnerIsabella from "../imports/students/learner-isabella.png";
import content from "./content";

// Photo lookup — maps student names from content.json to imported image assets
const STUDENT_PHOTOS: Record<string, string> = {
  "Sophia Patel":  learnerSophia,
  "Noah Kim":      learnerNoah,
  "Alex Thompson": learnerIsabella,
};

// Re-attach photo assets to chat script student readiness students
function attachPhotos<T extends { name: string }>(students: T[]): (T & { photo: string })[] {
  return students.map((s) => ({ ...s, photo: STUDENT_PHOTOS[s.name] ?? "" }));
}

const chatScriptMessages = content.chatScript.messages.map((m) => {
  if (m.card?.type === "student_readiness") {
    return {
      ...m,
      role: m.role as "user" | "agent",
      citations: (m.citations ?? []) as string[],
      card: {
        ...m.card,
        students: attachPhotos(m.card.students as { name: string }[]),
      },
    };
  }
  return {
    ...m,
    role: m.role as "user" | "agent",
    citations: (m.citations ?? []) as string[],
  };
});

const chatScriptBestPracticesMessages = content.chatScriptBestPractices.messages.map((m) => ({
  ...m,
  role: m.role as "user" | "agent",
  citations: (m.citations ?? []) as string[],
}));

export const defaultTokens = {
  brandName:          "Power Education",
  header:             content.header,
  hero:               content.hero,
  searchHero:         content.searchHero,
  searchBar:          content.searchBar,
  searchBarDropdown:  content.searchBarDropdown,
  categories:         content.categories,
  sidebar:            content.sidebar,
  chat:               content.chat,
  chatUI:             content.chatUI,
  chatScript:         { messages: chatScriptMessages },
  chatScriptBestPractices: { messages: chatScriptBestPracticesMessages },
  articlePanel:       content.articlePanel,
  articles:           content.articles,
};

export type Tokens = typeof defaultTokens;
