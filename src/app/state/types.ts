import { type Cypher } from "@/utils/cypher";

export type State = {
  cypher: Cypher;
  answerCypher: Cypher;
  id: string;
  quote: string;
  author: string;
  loading: boolean;
  error: boolean;
  win: boolean;
  completeWithError?: boolean;
  msElapsed: number;
  lastTick: number;
};

export enum ActionType {
  Clear = "clear",
  NewGame = "newGame",
  LoadGame = "loadGame",
  GiveUp = "giveUp",
  Loading = "loading",
  LoadError = "loadError",
  SetAnswer = "setAnswer",
  Tick = "tick",
}

export type Action =
  | { type: ActionType.Clear }
  | {
      type: ActionType.NewGame;
      payload: { id: string; quote: string; author: string };
    }
  | { type: ActionType.LoadGame }
  | { type: ActionType.GiveUp }
  | { type: ActionType.Loading }
  | { type: ActionType.LoadError }
  | {
      type: ActionType.SetAnswer;
      payload: { encoded: string; decoded: string };
    }
  | { type: ActionType.Tick };
