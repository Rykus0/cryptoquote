import { createCypher, cypherEncrypt } from "@/utils/cypher";

export const initialState: State = {
  encryptedQuote: "",
  answerMap: {},
  currentLetter: "",
  loading: false,
};

export type State = {
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
  | { type: ActionType.SetAnswer; payload: { letter: string; value: string } }
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
      const c = createCypher();

      const quote = action.payload.quote + " - " + action.payload.author;

      return {
        ...state,
        encryptedQuote: cypherEncrypt(quote, c),
        answerMap: c.reduce((accumulator, letter) => ({
          ...accumulator,
          [letter]: "",
        })),
        currentLetter: "",
        loading: false,
      };

    case ActionType.Loading:
      return {
        ...state,
        loading: true,
      };

    case ActionType.SetAnswer:
      return {
        ...state,
        answerMap: {
          ...state.answerMap,
          [action.payload.letter]: action.payload.value.toUpperCase(),
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
