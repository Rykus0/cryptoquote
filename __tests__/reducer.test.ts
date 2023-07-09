import reducer, { initialState } from "../src/app/state/reducer";
import { ActionType } from "../src/app/state/types";
import { deleteGame } from "../src/app/state/storage";
import { applyCypher } from "../src/utils/cypher";

describe("Reducer", () => {
  beforeEach(() => {
    deleteGame();
  });

  describe("Tick", () => {
    jest.useFakeTimers();

    it("should update the state's msElapsed and lastTick properties", () => {
      jest.advanceTimersByTime(1000);
      const state = reducer(
        { ...initialState, loading: false, lastTick: 0 },
        { type: ActionType.Tick }
      );

      expect(state.msElapsed).toBe(1000);
      expect(state.lastTick).toBe(1000);
    });

    it("should never increment by more than 1 second", () => {
      jest.advanceTimersByTime(10000);
      const state = reducer(
        { ...initialState, loading: false, lastTick: 0 },
        { type: ActionType.Tick }
      );

      expect(state.msElapsed).toBe(1000);
    });

    it("should not update the elapsed time while the document is hidden", () => {
      jest.advanceTimersByTime(1000);
      jest.spyOn(document, "hidden", "get").mockReturnValue(true);

      const state = reducer(
        { ...initialState, loading: false, lastTick: 0 },
        { type: ActionType.Tick }
      );

      expect(state.msElapsed).toBe(initialState.msElapsed);
    });

    it("should update the last tick while the document is hidden", () => {
      jest.advanceTimersByTime(1000);
      jest.spyOn(document, "hidden", "get").mockReturnValue(true);

      const state = reducer(
        { ...initialState, loading: false, lastTick: 0 },
        { type: ActionType.Tick }
      );

      expect(state.lastTick).toBe(1000);
    });

    it("should not update the elapsed time while loading", () => {
      jest.advanceTimersByTime(1000);

      const state = reducer(
        { ...initialState, lastTick: 0 },
        { type: ActionType.Tick }
      );

      expect(state.msElapsed).toBe(initialState.msElapsed);
    });

    it("should update the last tick while loading", () => {
      jest.advanceTimersByTime(1000);

      const state = reducer(
        { ...initialState, lastTick: 0 },
        { type: ActionType.Tick }
      );

      expect(state.lastTick).toBe(1000);
    });

    it("should not update the elapsed time after winning", () => {
      jest.advanceTimersByTime(1000);

      const state = reducer(
        { ...initialState, loading: false, win: true, lastTick: 0 },
        { type: ActionType.Tick }
      );

      expect(state.msElapsed).toBe(initialState.msElapsed);
    });

    it("should update the last tick after winning", () => {
      jest.advanceTimersByTime(1000);

      const state = reducer(
        { ...initialState, loading: false, win: true, lastTick: 0 },
        { type: ActionType.Tick }
      );

      expect(state.lastTick).toBe(1000);
    });

    it("should not update the elapsed time while there is an error", () => {
      jest.advanceTimersByTime(1000);

      const state = reducer(
        { ...initialState, loading: false, error: true, lastTick: 0 },
        { type: ActionType.Tick }
      );

      expect(state.msElapsed).toBe(initialState.msElapsed);
    });

    it("should update the last tick while the document is hidden", () => {
      jest.advanceTimersByTime(1000);

      const state = reducer(
        { ...initialState, loading: false, error: true, lastTick: 0 },
        { type: ActionType.Tick }
      );

      expect(state.lastTick).toBe(1000);
    });
  });

  describe("NewGame", () => {
    const quote = "This İs a test quøte.";
    const author = "Test Ç. Àuthor";

    jest.spyOn(Date, "now").mockReturnValue(1000);
    jest.spyOn(Storage.prototype, "setItem");

    const state = reducer(initialState, {
      type: ActionType.NewGame,
      payload: {
        id: "test",
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
      expect(state.quote).toBe(quote);
    });

    it("should record the quote author", () => {
      expect(state.author).toBe(author);
    });

    it("should reset the timer", () => {
      expect(state.msElapsed).toBe(0);
    });

    it("should reset the last tick", () => {
      expect(state.lastTick).toBe(1000);
    });

    it("should reset the loading state", () => {
      expect(state.loading).toBe(false);
    });

    it("should reset the win state", () => {
      expect(state.win).toBe(false);
    });

    it("should save game state", () => {
      expect(localStorage.setItem).toHaveBeenCalled();
    });
  });

  describe("Clear", () => {
    it("should reset the answer cypher", () => {
      const cypher = new Map([
        ["a", "b"],
        ["c", "d"],
      ]);

      const state = reducer(
        {
          ...initialState,
          cypher: cypher,
          answerCypher: new Map([["b", "a"]]),
        },
        { type: ActionType.Clear }
      );

      expect(state).toEqual({
        ...initialState,
        cypher: cypher,
        answerCypher: new Map([
          ["b", ""],
          ["d", ""],
        ]),
      });
    });
  });

  describe("Loading", () => {
    it("should set the loading state", () => {
      const state = reducer(initialState, { type: ActionType.Loading });

      expect(state).toEqual({ ...initialState, loading: true });
    });
  });

  describe("SetAnswer", () => {
    jest.spyOn(Storage.prototype, "setItem");
    jest.spyOn(Storage.prototype, "removeItem");

    it("should map the encoded letter to the given one in the answer cypher", () => {
      const state = reducer(initialState, {
        type: ActionType.SetAnswer,
        payload: { encoded: "a", decoded: "b" },
      });

      expect(state.answerCypher.get("a")).toBe("b");
    });

    it("should clear any existing cypher values for the given decoded letter", () => {
      const state = reducer(
        {
          ...initialState,
          answerCypher: new Map([
            ["a", "c"],
            ["b", ""],
          ]),
        },
        {
          type: ActionType.SetAnswer,
          payload: { encoded: "b", decoded: "c" },
        }
      );

      expect(state.answerCypher.get("a")).toBe("");
    });

    it("should not update state if the game is already won", () => {
      const state = reducer(
        {
          ...initialState,
          answerCypher: new Map([["a", "c"]]),
          win: true,
        },
        {
          type: ActionType.SetAnswer,
          payload: { encoded: "a", decoded: "b" },
        }
      );

      expect(state.answerCypher.get("a")).toBe("c");
    });

    it("should update the win state if the answer solves the cypher", () => {
      const state = reducer(
        {
          ...initialState,
          quote: "c",
          author: "d",
          cypher: new Map([
            ["c", "a"],
            ["d", "b"],
          ]),
          answerCypher: new Map([
            ["a", "c"],
            ["b", ""],
          ]),
        },
        {
          type: ActionType.SetAnswer,
          payload: { encoded: "b", decoded: "d" },
        }
      );

      expect(state.win).toBe(true);
    });

    it("should not be case sensitive when determining the win condition", () => {
      const state = reducer(
        {
          ...initialState,
          quote: "c",
          author: "d",
          cypher: new Map([
            ["c", "a"],
            ["d", "b"],
          ]),
          answerCypher: new Map([
            ["a", "c"],
            ["b", ""],
          ]),
        },
        {
          type: ActionType.SetAnswer,
          payload: { encoded: "b", decoded: "D" },
        }
      );

      expect(state.win).toBe(true);
    });

    it("should not update the win state if the answer does not solve the cypher", () => {
      const state = reducer(
        {
          ...initialState,
          quote: "c",
          author: "d",
          cypher: new Map([
            ["c", "a"],
            ["d", "b"],
          ]),
          answerCypher: new Map([
            ["a", "c"],
            ["b", ""],
          ]),
        },
        {
          type: ActionType.SetAnswer,
          payload: { encoded: "b", decoded: "x" },
        }
      );

      expect(state.win).toBe(false);
    });

    it("should indicate if comlpete with mistakes", () => {
      const state = reducer(
        {
          ...initialState,
          quote: "c",
          author: "d",
          cypher: new Map([
            ["c", "a"],
            ["d", "b"],
          ]),
          answerCypher: new Map([
            ["a", "c"],
            ["b", ""],
          ]),
        },
        {
          type: ActionType.SetAnswer,
          payload: { encoded: "b", decoded: "x" },
        }
      );

      expect(state.completeWithError).toBe(true);
    });

    it("should save game state after a non-winning answer", () => {
      reducer(initialState, {
        type: ActionType.SetAnswer,
        payload: { encoded: "a", decoded: "b" },
      });

      expect(localStorage.setItem).toHaveBeenCalled();
    });

    it("should clear game state on a win", () => {
      reducer(
        {
          ...initialState,
          quote: "c",
          author: "d",
          cypher: new Map([
            ["c", "a"],
            ["d", "b"],
          ]),
          answerCypher: new Map([
            ["a", "c"],
            ["b", ""],
          ]),
        },
        {
          type: ActionType.SetAnswer,
          payload: { encoded: "b", decoded: "d" },
        }
      );

      expect(localStorage.removeItem).toHaveBeenCalled();
    });
  });

  describe("GiveUp", () => {
    it("should set the answer cypher to the reverse of the current cypher and end the game", () => {
      const cypher = new Map([
        ["a", "b"],
        ["c", "d"],
      ]);
      const state = reducer(
        {
          ...initialState,
          cypher: cypher,
        },
        {
          type: ActionType.GiveUp,
        }
      );

      expect(state).toEqual({
        ...initialState,
        cypher: cypher,
        answerCypher: new Map([
          ["b", "a"],
          ["d", "c"],
        ]),
        win: true,
      });
    });
  });
});
