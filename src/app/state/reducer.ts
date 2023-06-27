import {
  applyCypher,
  generateCypher,
  clearCypherValue,
  getReverseCypher,
  type Cypher,
} from "@/utils/cypher";
import { normalizeQuote } from "@/utils/formatting";
import { ActionType, type Action, type State } from "./types";

export const initialState: State = {
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

export default function reducer(state: State, action: Action): State {
  switch (action.type) {
    case ActionType.Tick:
      const elapsed =
        document.hidden || state.win ? 0 : action.payload - state.lastTick;

      return {
        ...state,
        msElapsed: state.msElapsed + elapsed,
        lastTick: action.payload,
      };

    // -------------------------------------

    case ActionType.NewGame:
      const cypher = generateCypher();

      return {
        ...initialState,
        cypher: cypher,
        answerCypher: createEmptyReverseCypher(cypher),
        quote: action.payload.quote,
        author: action.payload.author,
        lastTick: Date.now(),
      };

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
      if (state.win) return state;

      const newAnswer = new Map(state.answerCypher);

      clearCypherValue(newAnswer, action.payload.decoded);
      newAnswer.set(action.payload.encoded, action.payload.decoded);

      return {
        ...state,
        answerCypher: newAnswer,
        win: isWin(state, newAnswer),
        completeWithError: isCompleteWithError(state, newAnswer),
      };

    // -------------------------------------

    case ActionType.GiveUp:
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
