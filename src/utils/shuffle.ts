// TODO: Should letters be allowed to map to themselves? And if so, how often?
export default function shuffle(array: any[]) {
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

// TODO: shuffle but do not allow any letters to map to themselves
// export function derange(original: any[]) {
// take from anywhere but the current index (or used indices)
// - remove current from unused and get random based on length
// - add current back to unused
// push to new array
// remove from original array
// }
