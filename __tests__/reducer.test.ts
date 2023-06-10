import reducer, { initialState, ActionType } from "../src/app/state/reducer";

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
});
