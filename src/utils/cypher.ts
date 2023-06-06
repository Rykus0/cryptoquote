import shuffle from "./shuffle";

const ALPHABET = [
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

export function createCypher() {
  return shuffle(ALPHABET);
}

export function cypherEncrypt(source: string, cypher: string[]) {
  return source
    .split("")
    .map((character) => {
      const index = getAlphabetIndex(character);

      if (index >= 0) {
        return cypher[index];
      }

      return character;
    })
    .join("");
}

export function getAlphabetIndex(char: string) {
  return ALPHABET.indexOf(char.toLowerCase());
}
