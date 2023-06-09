import {
  applyCypher,
  generateCypher,
  clearCypherValue,
  type Cypher,
} from "@/utils/cypher";

export type State = {
  cypher: Cypher;
  answerCypher: Cypher;
  quote: string;
  encryptedQuote: string;
  currentLetter: string;
  loading?: boolean;
  win?: boolean;
  msElapsed: number;
  lastTick: number;
};

export const initialState: State = {
  cypher: generateCypher(),
  answerCypher: new Map(),
  quote: "",
  encryptedQuote: "",
  currentLetter: "",
  loading: false,
  win: false,
  msElapsed: 0,
  lastTick: Date.now(),
};

export enum ActionType {
  Clear = "clear",
  NewGame = "newGame",
  Loading = "loading",
  SetAnswer = "setAnswer",
  SetCurrentLetter = "setCurrentLetter",
  Tick = "tick",
}

export type Action =
  | {
      type: ActionType.NewGame;
      payload: { quote: string; author: string };
    }
  | { type: ActionType.Loading }
  | {
      type: ActionType.SetAnswer;
      payload: { encoded: string; decoded: string };
    }
  | { type: ActionType.Clear }
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

    case ActionType.NewGame:
      const cypher = generateCypher();
      const quote = formatQuote(action.payload.quote, action.payload.author);

      return {
        ...initialState,
        cypher: cypher,
        answerCypher: createEmptyReverseCypher(cypher),
        quote: quote,
        encryptedQuote: applyCypher(quote, cypher),
        lastTick: Date.now(),
      };

    case ActionType.Clear:
      return {
        ...state,
        answerCypher: createEmptyReverseCypher(state.cypher),
      };

    case ActionType.Loading:
      return {
        ...state,
        loading: true,
      };

    case ActionType.SetAnswer:
      if (state.win) return state;

      const newAnswer = new Map(state.answerCypher);

      clearCypherValue(newAnswer, action.payload.decoded);
      newAnswer.set(action.payload.encoded, action.payload.decoded);

      return {
        ...state,
        answerCypher: newAnswer,
        win: applyCypher(state.encryptedQuote, newAnswer) === state.quote,
      };

    case ActionType.SetCurrentLetter:
      return {
        ...state,
        currentLetter: action.payload,
      };
  }
}

function formatQuote(quote: string, author: string) {
  return (
    quote.toLocaleLowerCase("en-US") + " - " + author.toLocaleLowerCase("en-US")
  );
}

function createEmptyReverseCypher(cypher: Cypher) {
  return new Map(Array.from(cypher.values()).map((v) => [v, ""]));
}
