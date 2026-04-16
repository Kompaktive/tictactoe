const ADJECTIVES = [
  "Bold",
  "Calm",
  "Deep",
  "Fast",
  "Glad",
  "Grim",
  "High",
  "Kind",
  "Large",
  "Mild",
  "Odd",
  "Pale",
  "Pure",
  "Rare",
  "Rich",
  "Safe",
  "Soft",
  "Tall",
  "Warm",
  "Wild",
];
const SUBJECTS = [
  "Boy",
  "Girl",
  "Sea",
  "Soul",
  "Face",
  "Heart",
  "Gem",
  "Moon",
  "Tree",
  "Life",
  "Wind",
  "Lake",
  "Fire",
  "Guest",
  "Introvert",
  "Extrovert",
  "Ambivert",
];

export const generateRandomNickname = (): string => {
  const randomPickedAdjective =
    ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const randomPickedSubject =
    SUBJECTS[Math.floor(Math.random() * SUBJECTS.length)];
  return `${randomPickedAdjective} ${randomPickedSubject}`;
};
