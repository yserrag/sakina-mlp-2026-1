export const VERIFIED_SOURCES = [
  {
    id: "v1",
    type: "quran",
    source: "Quran 94:5",
    arabic: "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا",
    transliteration: "Fa inna ma'al 'usri yusra",
    text: "So, verily, with every difficulty there is ease.",
    reflection: "Relief is not just a destination at the end of a trial; it is a companion throughout the journey. Allah provides the strength to endure at the same time He provides the test.",
    tags: ["hardship", "hope", "anxiety", "difficulty"]
  },
  {
    id: "v2",
    type: "quran",
    source: "Quran 2:152",
    arabic: "فَاذْكُرُونِي أَذْكُرْكُمْ",
    transliteration: "Fazkurunee azkurkum",
    text: "So remember Me; I will remember you.",
    reflection: "When you feel invisible to the world, remember that the King of Kings is mentioning your name in the highest assembly of angels the moment you call upon Him.",
    tags: ["connection", "mindfulness", "loneliness", "remember"]
  },
  {
    id: "v3",
    type: "quran",
    source: "Quran 14:7",
    arabic: "لَئِن شَكَرْتُمْ لَأَزِيدَنَّكُمْ",
    transliteration: "La-in shakartum la-azeedannakum",
    text: "If you are grateful, I will surely increase you.",
    reflection: "Gratitude is the key to abundance. By focusing on what you have been given, you open the spiritual doors for even greater blessings to flow into your life.",
    tags: ["gratitude", "abundance", "thanks", "increase"]
  },
  {
    id: "v4",
    type: "hadith",
    source: "Sahih Muslim",
    arabic: "الدُّنْيَا سِجْنُ الْمُؤْمِنِ وَجَنَّةُ الْكَافِرِ",
    transliteration: "Ad-dunya sijnul-mu'mini wa jannatul-kafir",
    text: "The world is a prison for the believer and a paradise for the disbeliever.",
    reflection: "This perspective reframes our struggles. If things feel restrictive or difficult here, it is because your true home—where you truly belong—is far more expansive and beautiful.",
    tags: ["perspective", "patience", "dunya", "struggle"]
  },
  {
    id: "v5",
    type: "quran",
    source: "Quran 2:186",
    arabic: "إِنِّي قَرِيبٌ ۖ أُجِيبُ دَعْوَةَ الدَّاعِ",
    transliteration: "Innee qareebun ujeebu da'watad-da'i",
    text: "Indeed I am near. I respond to the invocation of the supplicant.",
    reflection: "There is no intermediary needed between you and your Creator. He is closer to you than your jugular vein, listening to the whispers of your heart before you even speak them.",
    tags: ["dua", "closeness", "prayer", "response"]
  },
  {
    id: "v6",
    type: "hadith",
    source: "Sahih Bukhari",
    arabic: "يَسِّرُوا وَلاَ تُعَسِّرُوا",
    transliteration: "Yassiru wala tu'assiru",
    text: "Make things easy and do not make them difficult.",
    reflection: "Our faith is one of ease, not hardship. When you feel overwhelmed, simplify your worship and focus on consistent, small deeds that bring peace to your soul.",
    tags: ["simplicity", "mercy", "ease", "overwhelmed"]
  },
  {
    id: "v7",
    type: "quran",
    source: "Quran 39:53",
    arabic: "لَئِن شَكَرْتُمْ لَأَزِيدَنَّكُمْ",
    transliteration: "La taqnatoo min rahmatillah",
    text: "Do not despair of the mercy of Allah.",
    reflection: "No mistake is too big for the Ghafur (The All-Forgiving). Despair is a trick of the ego; mercy is the reality of the Divine. Turn back to Him, always.",
    tags: ["forgiveness", "mercy", "sin", "despair"]
  }
];

// [ANALYSIS] RAG Helper: Matches user queries to our verified content tags
export function getContextForQuery(query: string): string {
  const normalizedQuery = query.toLowerCase();
  
  // Find up to 3 relevant sources based on tag matching
  const relevantSources = VERIFIED_SOURCES.filter(source => 
    source.tags.some(tag => normalizedQuery.includes(tag.toLowerCase())) ||
    source.text.toLowerCase().includes(normalizedQuery) ||
    source.reflection.toLowerCase().includes(normalizedQuery)
  ).slice(0, 3);

  if (relevantSources.length === 0) return "";

  return `
RELEVANT ISLAMIC CONTEXT (Use these to answer):
${relevantSources.map(s => `
- Source: ${s.source}
- Text: "${s.text}"
- Reflection: ${s.reflection}
`).join('\n')}
`;
}