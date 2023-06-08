import {
  applyCypher,
  generateCypher,
  clearCypherValue,
  type Cypher,
} from "@/utils/cypher";

export const initialState: State = {
  cypher: generateCypher(),
  answerCypher: new Map(),
  quote: "",
  encryptedQuote: "",
  currentLetter: "",
  loading: false,
  win: false,
};

export type State = {
  cypher: Cypher;
  answerCypher: Cypher;
  quote: string;
  encryptedQuote: string;
  currentLetter: string;
  loading?: boolean;
  win?: boolean;
};

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
  | { type: ActionType.SetCurrentLetter; payload: string };

export enum ActionType {
  Clear = "clear",
  NewGame = "newGame",
  Loading = "loading",
  SetAnswer = "setAnswer",
  SetCurrentLetter = "setCurrentLetter",
}

export default function reducer(state: State, action: Action): State {
  switch (action.type) {
    case ActionType.NewGame:
      const cypher = generateCypher();
      const quote = formatQuote(action.payload.quote, action.payload.author);

      return {
        ...state,
        cypher: cypher,
        answerCypher: createEmptyReverseCypher(cypher),
        quote: quote,
        encryptedQuote: applyCypher(quote, cypher),
        currentLetter: "",
        loading: false,
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

  return state;

  // throw new Error(`Unhandled action type: ${action.type}`);

  // TODO: Actions
  // - New game
  // -- Create cypher
  // -- Encrypt quote
  // - Restart
  // -- Clear answer
  // -- Focus to first letter (?)
  // - Guess letter: { type: 'guess', letter: 'a', cypherLetter: 'b' }
  // -- Update answer
  // -- Check if won: answer cypher == cypher
  // --- Yes: display win message
  // --- No: Are there blanks?
  // ---- Yes: Focus next letter
  // ---- No: display incorrect message
}

function formatQuote(quote: string, author: string) {
  return (
    quote.toLocaleLowerCase("en-US") + " - " + author.toLocaleLowerCase("en-US")
  );
}

function createEmptyReverseCypher(cypher: Cypher) {
  return new Map(Array.from(cypher.values()).map((v) => [v, ""]));
}
