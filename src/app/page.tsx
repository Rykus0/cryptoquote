"use client";

import {
  useReducer,
  type ChangeEvent,
  type FocusEvent,
  type Reducer,
} from "react";
import styles from "./page.module.css";
import Letter from "@/app/components/Letter";
import Word from "@/app/components/Word";
import reducer, {
  initialState,
  ActionType,
  type State,
  type Action,
} from "@/app/state/reducer";

// TODO
// - State Persistence
// - Timer
// - Letter frequency
// - Give up (reveal all)
// - Hint (reveal letter)
// - Win condition
// -- decrypted answer equals quote
// - Loading state - visual
// -- random placeholder elements of random length
// - Improve visuals
// - improve focus management

// state improvement
// answerCypher: Map<string, string>
// win when applyCypher(encryptedQuote, answerCypher) === quote

const ID_DELIM = ":";

function focusNextLetter(currentId: string) {
  const nextInput = getNextEmptyLetter(currentId);

  if (nextInput) {
    nextInput.focus();
  }
}

function createLetterId(wordIdx: number, letterIdx: number) {
  return ["letter", wordIdx, letterIdx].join(ID_DELIM);
}

function getNextEmptyLetter(letterId: string) {
  const { wordIdx, letterIdx } = parseLetterId(letterId);
  const nextId = createLetterId(wordIdx, letterIdx + 1);

  const nextEl = document.getElementById(nextId) as HTMLInputElement;
  if (nextEl) {
    if (nextEl.value || nextEl.hasAttribute("readonly")) {
      return getNextEmptyLetter(nextId);
    } else {
      return nextEl;
    }
  } else if (letterIdx === -1) {
    return null;
  } else {
    return getNextEmptyLetter(createLetterId(wordIdx + 1, -1));
  }
}

function parseLetterId(letterId: string) {
  const [label, wordIdx, letterIdx] = letterId.split(ID_DELIM);
  return {
    label,
    wordIdx: parseInt(wordIdx, 10),
    letterIdx: parseInt(letterIdx, 10),
  };
}

async function getQuote() {
  const response = await fetch("https://api.quotable.io/random");
  const data = await response.json();

  return {
    quote: data.content,
    author: data.author,
    // tags: data.tags,
  };
}

export default function Home() {
  const [state, dispatch] = useReducer<Reducer<State, Action>>(
    reducer,
    initialState
  );

  async function newGame() {
    dispatch({ type: ActionType.Loading });
    const { quote, author } = await getQuote();
    dispatch({ type: ActionType.NewGame, payload: { quote, author } });
  }

  function updateAnswer(e: ChangeEvent<HTMLInputElement>) {
    dispatch({
      type: ActionType.SetAnswer,
      payload: { encoded: e.target.name, decoded: e.target.value },
    });

    // Do this after the update goes through
    if (e.target.value) {
      window.requestAnimationFrame(() => focusNextLetter(e.target.id));
    }
  }

  function focusLetter(e: FocusEvent<HTMLInputElement>) {
    dispatch({ type: ActionType.SetCurrentLetter, payload: e.target.name });
  }

  return (
    <main>
      <h1>Cryptoquote</h1>

      <button onClick={newGame}>New game</button>

      <div className={styles.quote}>
        {state.loading ? (
          <span>loading...</span>
        ) : (
          state.encryptedQuote
            .split(/\s+/)
            .map((word: string, wordIdx: number) => (
              <Word key={`word-${word}-${wordIdx}`}>
                {word.split("").map((char: string, charIdx: number) => (
                  <Letter
                    key={createLetterId(wordIdx, charIdx)}
                    id={createLetterId(wordIdx, charIdx)}
                    char={char}
                    onChange={updateAnswer}
                    onFocus={focusLetter}
                    highlighted={state.currentLetter === char}
                    value={state.answerCypher.get(char)}
                  />
                ))}
              </Word>
            ))
        )}
      </div>
    </main>
  );
}
