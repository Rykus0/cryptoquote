export function normalizeQuote(quote: string) {
  return removeAccentsAndDiacritics(quote).toLocaleLowerCase("en-US");
}

function removeAccentsAndDiacritics(str: string) {
  const str2 = str.replace(/ø/g, "o").replace(/Ø/g, "O");

  if (str2.normalize) {
    return str2.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  return str2;
}

export function getLetterFrequencies(value: string) {
  return value.split("").reduce((prev, letter) => {
    const count = prev.get(letter) ?? 0;
    prev.set(letter, count + 1);

    return prev;
  }, new Map<string, number>());
}
