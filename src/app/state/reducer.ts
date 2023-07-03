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

// TODO
// - Return initial state from a function:
//   - Check for saved game on load and return state if present

const initialState: State = {
  cypher: generateCypher(),
  answerCypher: new Map(),
  quote: "",
  author: "",
  loading: false,
  error: false,
  win: false,
  completeWithError: false,
  msElapsed: 0,
  lastTick: Date.now(),
};

export function getInitialState(): State {
  const gameData = loadGame();

  return gameData ? gameData : initialState;
}

export default function reducer(state: State, action: Action): State {
  switch (action.type) {
    case ActionType.Tick:
      const shouldNotTick =
        document.hidden || state.loading || state.win || state.error;
      const elapsed = shouldNotTick ? 0 : action.payload - state.lastTick;

      return {
        ...state,
        msElapsed: state.msElapsed + elapsed,
        lastTick: action.payload,
      };

    // -------------------------------------

    case ActionType.NewGame:
      const cypher = generateCypher();

      const newState = {
        ...initialState,
        cypher: cypher,
        answerCypher: createEmptyReverseCypher(cypher),
        quote: action.payload.quote,
        author: action.payload.author,
        lastTick: Date.now(),
      };

      saveGame(newState);

      return newState;

    // -------------------------------------

    case ActionType.Clear:
      return {
        ...state,
        answerCypher: createEmptyReverseCypher(state.cypher),
        completeWithError: false,
      };

    // -------------------------------------

    case ActionType.Loading:
      return {
        ...initialState,
        loading: true,
      };

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
