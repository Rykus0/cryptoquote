import {
  createCypher,
  cypherEncrypt,
  ALPHABET,
  type Cypher,
} from "@/utils/cypher";
import getKeyByValue from "@/utils/getKeyByValue";

export const initialState: State = {
  cypher: [],
  encryptedQuote: "",
  answerMap: {},
  currentLetter: "",
  loading: false,
};

export type State = {
  cypher: Cypher;
  encryptedQuote: string;
  answerMap: Record<string, string>;
  currentLetter: string;
  loading?: boolean;
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
  | { type: ActionType.SetCurrentLetter; payload: string };

export enum ActionType {
  NewGame = "newGame",
  Loading = "loading",
  SetAnswer = "setAnswer",
  SetCurrentLetter = "setCurrentLetter",
}

export default function reducer(state: State, action: Action): State {
  switch (action.type) {
    case ActionType.NewGame:
      const cypher = createCypher();

      const quote =
        action.payload.quote.toLocaleLowerCase("en-US") +
        " - " +
        action.payload.author.toLocaleLowerCase("en-US");

      return {
        ...state,
        cypher: cypher,
        encryptedQuote: cypherEncrypt(quote, cypher),
        answerMap: ALPHABET.reduce(
          (accumulator, letter) => ({
            ...accumulator,
            [letter]: "",
          }),
          {}
        ),
        currentLetter: "",
        loading: false,
      };

    case ActionType.Loading:
      return {
        ...state,
        loading: true,
      };

    case ActionType.SetAnswer:
      const dupKey = getKeyByValue(state.answerMap, action.payload.decoded);

      return {
        ...state,
        answerMap: {
          ...state.answerMap,
          [action.payload.encoded]: action.payload.decoded,
          ...(dupKey && { [dupKey]: "" }),
        },
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
