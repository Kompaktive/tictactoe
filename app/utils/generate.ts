import { PREFIXES, SUBJECTS } from "~/constants/nicknames";

export const generateRandomCode = (length: number = 8): string => {
  // modified base62 alphabet (removed ambiguous chars: 0,O,I,1,l)
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";
  let result: string = "";

  const randomValues = new Uint32Array(length);
  crypto.getRandomValues(randomValues);

  for (let i = 0; i < length; i++) {
    result += chars[randomValues[i] % chars.length];
  }

  return result;
};

export const generateRandomNickname = (): string => {
  const randomPickedAdjective =
    PREFIXES[Math.floor(Math.random() * PREFIXES.length)];
  const randomPickedSubject =
    SUBJECTS[Math.floor(Math.random() * SUBJECTS.length)];
  return `${randomPickedAdjective} ${randomPickedSubject}`;
};
