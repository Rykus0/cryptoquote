import { type Cypher } from "@/utils/cypher";

export type State = {
  cypher: Cypher;
  answerCypher: Cypher;
  quote: string;
  author: string;
  loading?: boolean;
  win?: boolean;
  completeWithError?: boolean;
  msElapsed: number;
  lastTick: number;
};

export enum ActionType {
  Clear = "clear",
  NewGame = "newGame",
  GiveUp = "giveUp",
  Loading = "loading",
  SetAnswer = "setAnswer",
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
  | { type: ActionType.Tick; payload: number };
