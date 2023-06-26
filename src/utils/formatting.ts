export function combineQuote(quote: string, author: string) {
  return quote + " — " + author;
}

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
