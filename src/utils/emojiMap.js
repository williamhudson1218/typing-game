// A comprehensive dictionary of common words and their emojis
export const autoEmojiMap = {
  // Initial word list
  tree: "🌳",
  broom: "🧹",
  egg: "🥚",
  flag: "🚩",
  shell: "🐚",
  kite: "🪁",
  star: "⭐",
  dress: "👗",
  shirt: "👕",

  // Related household items
  brush: "🧹",
  mop: "🧹",
  vacuum: "🧹",
  sweep: "🧹",
  clean: "🧹",

  // Related nature items
  plant: "🌱",
  flower: "🌸",
  palm: "🌴",
  pine: "🌲",
  forest: "🌳",
  leaf: "🍁",

  // Related food items
  eggs: "🥚",
  chicken: "🐔",
  nest: "🪺",
  breakfast: "🍳",

  // Related clothing
  pants: "👖",
  shoes: "👞",
  socks: "🧦",
  hat: "🎩",
  coat: "🧥",

  // Related sky/space items
  moon: "🌙",
  sun: "☀️",
  stars: "✨",
  sky: "🌌",
  space: "🌠",
  rocket: "🚀",

  // Beach/ocean related
  beach: "🏖️",
  ocean: "🌊",
  sea: "🌊",
  sand: "🏖️",
  wave: "🌊",
  seashell: "🐚",
  conch: "🐚",

  // Additional common words
  ball: "⚽",
  book: "📚",
  car: "🚗",
  house: "🏠",
  phone: "📱",
  heart: "❤️",
  smile: "😊",
  fish: "🐟",
  bird: "🐦",
  cat: "🐱",
  dog: "🐶",

  // Food
  apple: "🍎",
  banana: "🍌",
  pizza: "🍕",
  cake: "🍰",
  bread: "🍞",
  cookie: "🍪",
  milk: "🥛",
  ice: "🧊",
  candy: "��",

  // Nature
  cloud: "☁️",
  snow: "❄️",

  // Objects
  pen: "🖊️",
  pencil: "✏️",
  clock: "⏰",
  key: "🔑",
  lock: "🔒",
  gift: "🎁",
  bus: "🚌",
  train: "🚂",
  door: "🚪",
  window: "🪟",
  bed: "🛏️",
  chair: "🪑",

  // Clothes
  shoe: "👞",

  // Body
  eye: "👁️",
  ear: "👂",
  nose: "👃",
  mouth: "👄",
  foot: "🦶",

  // Emotions
  happy: "😊",
  sad: "😢",
  angry: "😠",
  love: "❤️",

  // Colors
  red: "🔴",
  blue: "🔵",
  green: "💚",
  yellow: "💛",

  // School
  school: "🏫",
  paper: "📝",
  ruler: "📏",

  // Weather
  hot: "🌡️",
  cold: "🥶",
  wind: "💨",
  storm: "⛈️",

  // Sports
  swim: "🏊",
  run: "🏃",
  jump: "⬆️",
  dance: "💃",

  // Common verbs
  drink: "🥤",
  sleep: "😴",
  walk: "🚶",
  write: "✍️",

  // Misc
  yes: "✅",
  no: "❌",
  stop: "🛑",
  go: "✅",
  play: "▶️",
};

export const suggestEmoji = (word) => {
  word = word.toLowerCase().trim();

  // Direct match
  if (autoEmojiMap[word]) {
    return autoEmojiMap[word];
  }

  // Check for plural forms
  if (word.endsWith("s") && autoEmojiMap[word.slice(0, -1)]) {
    return autoEmojiMap[word.slice(0, -1)];
  }

  // Check for -ing forms
  if (word.endsWith("ing") && autoEmojiMap[word.slice(0, -3)]) {
    return autoEmojiMap[word.slice(0, -3)];
  }

  return null;
};

// Function to find closest matching word
export const findClosestMatch = (input, validWords) => {
  input = input.toLowerCase().trim();

  // Direct match
  if (validWords.includes(input)) {
    return input;
  }

  // Simple fuzzy match (allows for common typos)
  for (const word of validWords) {
    // Allow one character difference
    if (levenshteinDistance(input, word) <= 1) {
      return word;
    }
  }

  return null;
};

// Levenshtein distance for fuzzy matching
const levenshteinDistance = (str1, str2) => {
  const track = Array(str2.length + 1)
    .fill(null)
    .map(() => Array(str1.length + 1).fill(null));
  for (let i = 0; i <= str1.length; i += 1) {
    track[0][i] = i;
  }
  for (let j = 0; j <= str2.length; j += 1) {
    track[j][0] = j;
  }
  for (let j = 1; j <= str2.length; j += 1) {
    for (let i = 1; i <= str1.length; i += 1) {
      const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
      track[j][i] = Math.min(
        track[j][i - 1] + 1,
        track[j - 1][i] + 1,
        track[j - 1][i - 1] + indicator
      );
    }
  }
  return track[str2.length][str1.length];
};
