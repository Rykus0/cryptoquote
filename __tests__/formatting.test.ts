import { normalizeQuote, getLetterFrequencies } from "../src/utils/formatting";

describe("normalizeQuote", () => {
  it("should remove accents and diacritics", () => {
    const quote = "This İs a test quøte. - Test Ç. Àuthor";

    expect(normalizeQuote(quote)).toBe(
      "this is a test quote. - test c. author"
    );
  });

  it("should convert to lowercase", () => {
    const quote = "I LOVE LAMP!";

    expect(normalizeQuote(quote)).toBe("i love lamp!");
  });
});

describe("getLetterFrequencies", () => {
  it("should return the count of each letter in the string", () => {
    const letterFrequencies = getLetterFrequencies("abbccc");

    expect(letterFrequencies.get("a")).toBe(1);
    expect(letterFrequencies.get("b")).toBe(2);
    expect(letterFrequencies.get("c")).toBe(3);
    expect(letterFrequencies.get("d")).toBeUndefined;
  });
});
