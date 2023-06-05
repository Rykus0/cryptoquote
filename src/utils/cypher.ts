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

function shuffle(array: any[]) {
  let shuffled = [...array];
  let currentIndex = shuffled.length;
  let randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [shuffled[currentIndex], shuffled[randomIndex]] = [
      shuffled[randomIndex],
      shuffled[currentIndex],
    ];
  }

  return shuffled;
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
