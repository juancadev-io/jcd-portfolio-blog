const WORDS_PER_MINUTE = 200;

const countWords = (text: string) =>
  text
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/[#*_>~\-]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .filter(Boolean).length;

export const calculateReadingTime = (content: string) =>
  Math.max(1, Math.ceil(countWords(content) / WORDS_PER_MINUTE));
