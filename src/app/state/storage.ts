import { type State } from "./types";

const GAME_KEY = "savedGame";
const HISTORY_KEY = "gameHistory";

export function saveGame(data: State) {
  try {
    window.localStorage.setItem(GAME_KEY, JSON.stringify(data, replacer));
  } catch (error) {}
}

export function loadGame(): State | null {
  try {
    const data = window.localStorage.getItem(GAME_KEY);

    if (data) {
      return JSON.parse(data, reviver);
    }
  } catch (error) {
    return null;
  }

  return null;
}

export function deleteGame() {
  try {
    window.localStorage.removeItem(GAME_KEY);
  } catch (error) {}
}

function replacer(key: string, value: unknown) {
  if (value instanceof Map) {
    return Array.from(value.entries()); // or with spread: value: [...value]
  }

  return value;
}

function reviver(key: string, value: unknown) {
  if (key === "cypher" || key === "answerCypher") {
    return new Map(value as []);
  }
  return value;
}

// -------------------------------------

type HistoricalGame = {
  id: string;
  quote: string;
  author: string;
  msElapsed: number;
  win: boolean;
  date: Date;
};

type History = HistoricalGame[];

export function addHistory(data: HistoricalGame) {
  try {
    const history = getHistory() ?? [];
    history.unshift(data);
    window.localStorage.setItem(HISTORY_KEY, JSON.stringify(data));
  } catch (error) {
    console.error(error);
  }
}

export function getHistory(): History | null {
  try {
    const data = window.localStorage.getItem(HISTORY_KEY);

    if (data) {
      return JSON.parse(data);
    }
  } catch (error) {
    return null;
  }

  return null;
}
