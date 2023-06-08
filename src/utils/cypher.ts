import shuffle from "./shuffle";

export type Cypher = Map<string, string>;

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

export function generateCypher(): Cypher {
  const randomizedAlphabet = shuffle(ALPHABET);

  return new Map(zip(ALPHABET, randomizedAlphabet));
}

function zip<T, U>(a: T[], b: U[]): [T, U][] {
  return a.map((item, index) => [item, b[index]]);
}

export function applyCypher(source: string, cypher: Cypher) {
  return source
    .split("")
    .map((character) => {
      return cypher.get(character) ?? character;
    })
    .join("");
}

// TODO: only clears the first occurance
export function clearCypherValue(cypher: Cypher, value: string) {
  const dupKey = getKeyByValue(cypher, value);
  if (dupKey) {
    cypher.set(dupKey, "");
  }
}

function getKeyByValue(cypher: Cypher, searchValue: string) {
  for (const [key, value] of cypher.entries()) {
    if (value === searchValue) {
      return key;
    }
  }

  return null;
}
