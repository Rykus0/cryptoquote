import {
  applyCypher,
  generateCypher,
  clearCypherValue,
  getReverseCypher,
  type Cypher,
} from "@/utils/cypher";

export type State = {
  cypher: Cypher;
  answerCypher: Cypher;
  quote: string;
  author: string;
  encryptedQuote: string;
  letterFrequency: Map<string, number>;
  currentLetter: string;
  loading?: boolean;
  win?: boolean;
  completeWithError?: boolean;
  msElapsed: number;
  lastTick: number;
};

export const initialState: State = {
  cypher: generateCypher(),
  answerCypher: new Map(),
  quote: "",
  author: "",
  encryptedQuote: "",
  letterFrequency: new Map(),
  currentLetter: "",
  loading: false,
  win: false,
  completeWithError: false,
  msElapsed: 0,
  lastTick: Date.now(),
};

export enum ActionType {
  Clear = "clear",
  NewGame = "newGame",
  GiveUp = "giveUp",
  Loading = "loading",
  SetAnswer = "setAnswer",
  SetCurrentLetter = "setCurrentLetter",
  Tick = "tick",
}

export type Action =
  | { type: ActionType.Clear }
  | {
      type: ActionType.NewGame;
      payload: { quote: string; author: string };
    }
  | { type: ActionType.GiveUp }
  | { type: ActionType.Loading }
  | {
      type: ActionType.SetAnswer;
      payload: { encoded: string; decoded: string };
    }
  | { type: ActionType.SetCurrentLetter; payload: string }
  | { type: ActionType.Tick; payload: number };

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
      const combinedQuote = combineQuote(
        action.payload.quote,
        action.payload.author
      );
      const encrypted = applyCypher(normalizeQuote(combinedQuote), cypher);

      return {
        ...initialState,
        cypher: cypher,
        answerCypher: createEmptyReverseCypher(cypher),
        quote: action.payload.quote,
        author: action.payload.author,
        encryptedQuote: encrypted,
        letterFrequency: getLetterFrequencies(encrypted),
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
        ...state,
        loading: true,
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

    case ActionType.SetCurrentLetter:
      return {
        ...state,
        currentLetter: action.payload,
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
  return (
    normalizeQuote(applyCypher(state.encryptedQuote, newAnswer)) ===
    normalizeQuote(combineQuote(state.quote, state.author))
  );
}

function isCompleteWithError(state: State, newAnswer: Cypher) {
  return (
    !isWin(state, newAnswer) &&
    applyCypher(state.encryptedQuote, newAnswer).length ===
      combineQuote(state.quote, state.author).length
  );
}

export function combineQuote(quote: string, author: string) {
  return quote + " — " + author;
}

export function normalizeQuote(quote: string) {
  return removeAccentsAndDiacritics(quote).toLocaleLowerCase("en-US");
}

function removeAccentsAndDiacritics(str: string) {
  const str2 = str.replace(/ø/g, "o").replace(/Ø/g, "O");

  if (str2.normalize) {
    return str2.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  return str2;
}

function createEmptyReverseCypher(cypher: Cypher) {
  return new Map(Array.from(cypher.values()).map((v) => [v, ""]));
}

function getLetterFrequencies(quote: string) {
  return quote.split("").reduce((prev, letter) => {
    if (prev.has(letter)) {
      const count = prev.get(letter) ?? 0;
      prev.set(letter, count + 1);
    } else {
      prev.set(letter, 1);
    }
    return prev;
  }, new Map<string, number>());
}
