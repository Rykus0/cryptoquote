import { type State } from "./types";

const STORAGE_KEY = "savedGame";

export function saveGame(data: State) {
  if (localStorage) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data, replacer));
  }
}

export function loadGame(): State | null {
  if (localStorage) {
    const data = localStorage.getItem(STORAGE_KEY);

    if (data) {
      return JSON.parse(data, reviver);
    }
  }

  return null;
}

export function deleteGame() {
  if (localStorage) {
    localStorage.removeItem(STORAGE_KEY);
  }
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
