import { type State } from "./types";

const STORAGE_KEY = "savedGame";

export function saveGame(data: State) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data, replacer));
  } catch (error) {}
}

export function loadGame(): State | null {
  try {
    const data = window.localStorage.getItem(STORAGE_KEY);

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
    window.localStorage.removeItem(STORAGE_KEY);
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
