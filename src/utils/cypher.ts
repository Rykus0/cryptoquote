import shuffle from "./shuffle";

export type Cypher = string[];

export const ALPHABET = [
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z",
];

export function createCypher(): Cypher {
  return shuffle(ALPHABET);
}

export function cypherEncrypt(source: string, cypher: Cypher) {
  return source
    .split("")
    .map((character) => {
      const index = getAlphabetIndex(character.toLowerCase());

      if (index >= 0) {
        return cypher[index];
      }

      return character;
    })
    .join("");
}

export function cypherDecrypt(encrypted: string, cypher: Cypher) {
  return encrypted
    .split("")
    .map((character) => {
      const index = cypher.indexOf(character.toLowerCase());

      if (index >= 0) {
        return ALPHABET[index];
      }

      return character;
    })
    .join("");
}

export function getAlphabetIndex(char: string) {
  return ALPHABET.indexOf(char.toLowerCase());
}
