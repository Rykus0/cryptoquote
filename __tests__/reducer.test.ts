import reducer, {
  initialState,
  ActionType,
  normalizeQuote,
} from "../src/app/state/reducer";
import { applyCypher } from "../src/utils/cypher";

describe("Reducer", () => {
  describe("Tick", () => {
    it("should update the state's msElapsed and lastTick properties", () => {
      const interimState = reducer(
        { ...initialState, lastTick: 0 },
        {
          type: ActionType.Tick,
          payload: 1000,
        }
      );
      const state = reducer(interimState, {
        type: ActionType.Tick,
        payload: 2000,
      });

      expect(state.msElapsed).toBe(2000);
      expect(state.lastTick).toBe(2000);
    });

    it("should not update the timer while the document is hidden", () => {
      const interimState = reducer(
        { ...initialState, lastTick: 0 },
        {
          type: ActionType.Tick,
          payload: 1000,
        }
      );

      jest.spyOn(document, "hidden", "get").mockReturnValue(true);

      const state = reducer(interimState, {
        type: ActionType.Tick,
        payload: 2000,
      });

      expect(state.msElapsed).toBe(1000);
      expect(state.lastTick).toBe(2000);
    });
  });

  describe("NewGame", () => {
    const quote = "This İs a test quøte.";
    const author = "Test Ç. Àuthor";

    jest.spyOn(Date, "now").mockReturnValue(1000);

    const state = reducer(initialState, {
      type: ActionType.NewGame,
      payload: {
        quote,
        author,
      },
    });

    it("should create a new cypher", () => {
      expect(state.cypher).toBeInstanceOf(Map);
    });

    it("should create a new answer cypher", () => {
      expect(applyCypher("i", state.answerCypher)).toBe("");
    });

    it("should record the original quote", () => {
      expect(state.quote).toBe(quote + " - " + author);
    });

    it("should encrypt the quote", () => {
      expect(state.encryptedQuote).toEqual(
        applyCypher(normalizeQuote(state.quote), state.cypher)
      );
    });

    it("should record the encrypted letter frequency", () => {
      expect(state.letterFrequency.get(applyCypher("t", state.cypher))).toBe(7);
    });

    it("should reset the timer", () => {
      expect(state.msElapsed).toBe(0);
    });

    it("should reset the last tick", () => {
      expect(state.lastTick).toBe(1000);
    });

    it("should clear the current highlighted letter", () => {
      expect(state.currentLetter).toBe("");
    });

    it("should reset the loading state", () => {
      expect(state.loading).toBe(false);
    });

    it("should reset the win state", () => {
      expect(state.win).toBe(false);
    });
  });

  describe("Clear", () => {
    it("should reset the answer cypher", () => {
      const startState = { ...initialState };
      startState.answerCypher.set("t", "a");

      const state = reducer(startState, { type: ActionType.Clear });

      expect(state.answerCypher.get("t")).toBe("");
    });
  });

  describe("Loading", () => {
    it("should set the loading state", () => {
      const state = reducer(initialState, { type: ActionType.Loading });

      expect(state.loading).toBe(true);
    });
  });
});
