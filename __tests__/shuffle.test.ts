import shuffle from "../src/utils/shuffle";

describe("Shuffle Utility", () => {
  const testArray = [1, 2, 3, 4, 5];

  // TODO: Determine threshold for this matching original
  // TODO: Add derange option (easier difficulty)
  it.skip("should return an array not matching the original order", () => {
    const shuffled = shuffle(testArray);
    let atLeastOneDifferent = false;

    shuffled.forEach((item, index) => {
      if (item !== testArray[index]) {
        atLeastOneDifferent = true;
      }
    });

    expect(atLeastOneDifferent).toBe(true);
  });

  it("should contain the same items as the original", () => {
    const shuffled = shuffle(testArray);

    shuffled.forEach((item) => {
      expect(testArray).toContain(item);
    });
  });

  it("should not modify the original array", () => {
    shuffle(testArray);
    expect(testArray).toEqual([1, 2, 3, 4, 5]);
  });
});
