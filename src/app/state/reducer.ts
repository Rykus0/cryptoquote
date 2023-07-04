import {
  applyCypher,
  generateCypher,
  clearCypherValue,
  getReverseCypher,
  type Cypher,
} from "@/utils/cypher";
import { normalizeQuote } from "@/utils/formatting";
import { ActionType, type Action, type State } from "./types";
import { deleteGame, loadGame, saveGame } from "./storage";

export const initialState: State = {
  cypher: new Map(),
  answerCypher: new Map(),
  quote: "",
  author: "",
  loading: true,
  error: false,
  win: false,
  completeWithError: false,
  msElapsed: 0,
  lastTick: Date.now(),
};

export default function reducer(state: State, action: Action): State {
  switch (action.type) {
    case ActionType.Tick:
      const shouldNotTick =
        document.hidden || state.loading || state.win || state.error;
      const elapsed = shouldNotTick ? 0 : action.payload - state.lastTick;

      const tickState = {
        ...state,
        msElapsed: state.msElapsed + elapsed,
        lastTick: action.payload,
      };

      saveGame(tickState);

      return tickState;

    // -------------------------------------

    case ActionType.NewGame:
      const cypher = generateCypher();

      const newState = {
        ...initialState,
        cypher: cypher,
        answerCypher: createEmptyReverseCypher(cypher),
        quote: action.payload.quote,
        author: action.payload.author,
        loading: false,
        lastTick: Date.now(),
      };

      saveGame(newState);

      return newState;

    // -------------------------------------

    case ActionType.LoadGame:
      const loadState = loadGame();

      return loadState ? { ...loadState, lastTick: Date.now() } : initialState;

    // -------------------------------------

    case ActionType.Clear:
      return {
        ...state,
        answerCypher: createEmptyReverseCypher(state.cypher),
        completeWithError: false,
      };

    // -------------------------------------

    case ActionType.Loading:
      return initialState;

    // -------------------------------------

    case ActionType.LoadError:
      return {
        ...state,
        loading: false,
        error: true,
        win: false,
        completeWithError: false,
      };

    // -------------------------------------

    case ActionType.SetAnswer:
      if (state.win) {
        return state;
      }

      const newAnswer = new Map(state.answerCypher);

      clearCypherValue(newAnswer, action.payload.decoded);
      newAnswer.set(action.payload.encoded, action.payload.decoded);

      const answerState = {
        ...state,
        answerCypher: newAnswer,
        win: isWin(state, newAnswer),
        completeWithError: isCompleteWithError(state, newAnswer),
      };

      if (answerState.win) {
        deleteGame();
      } else {
        saveGame(answerState);
      }

      return answerState;

    // -------------------------------------

    case ActionType.GiveUp:
      deleteGame();

      return {
        ...state,
        answerCypher: getReverseCypher(state.cypher),
        win: true,
      };
  }

  return state;
}

// -------------------------------------

function isWin(state: State, newAnswer: Cypher) {
  const encryptedQuote = applyCypher(normalizeQuote(state.quote), state.cypher);
  const encryptedAuthor = applyCypher(
    normalizeQuote(state.author),
    state.cypher
  );

  return (
    normalizeQuote(applyCypher(encryptedQuote, newAnswer)) ===
      normalizeQuote(state.quote) &&
    normalizeQuote(applyCypher(encryptedAuthor, newAnswer)) ===
      normalizeQuote(state.author)
  );
}

function isCompleteWithError(state: State, newAnswer: Cypher) {
  const encryptedQuote = applyCypher(normalizeQuote(state.quote), state.cypher);
  const encryptedAuthor = applyCypher(
    normalizeQuote(state.author),
    state.cypher
  );
  const quoteComplete =
    applyCypher(encryptedQuote, newAnswer).length === state.quote.length;
  const authorComplete =
    applyCypher(encryptedAuthor, newAnswer).length === state.author.length;

  return !isWin(state, newAnswer) && quoteComplete && authorComplete;
}

function createEmptyReverseCypher(cypher: Cypher) {
  return new Map(Array.from(cypher.values()).map((v) => [v, ""]));
}
