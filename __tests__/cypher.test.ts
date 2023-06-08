import {
  generateCypher,
  applyCypher,
  clearCypherValue,
} from "../src/utils/cypher";

describe("Cypher Utilities", () => {
  describe("generateCypher()", () => {
    it("should generate a cypher for the English alphabet", () => {
      const cypher = generateCypher();
      expect(cypher?.size).toBe(26);
    });
  });

  describe("applyCypher()", () => {
    it("should apply a cypher to a string", () => {
      const cypher = generateCypher();
      const test = "abcdefghijklmnopqrstuvwxyz";

      expect(applyCypher(test, cypher)).not.toEqual(test);
    });
  });

  describe("clearCypherValue()", () => {
    it("should clear an instance of a given value", () => {
      const cypher = generateCypher();
      cypher.set("a", "b");
      clearCypherValue(cypher, "b");

      expect(cypher.get("a")).toBe("");
    });
  });
});
