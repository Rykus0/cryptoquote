import { combineQuote, normalizeQuote } from "../src/utils/formatting";

describe("combineQuote", () => {
  it("should combine quote and author separated by an emdash", () => {
    expect(combineQuote("quote", "author")).toBe("quote — author");
  });
});

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
