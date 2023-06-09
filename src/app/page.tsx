"use client";

import {
  useEffect,
  useReducer,
  useRef,
  type ChangeEvent,
  type FocusEvent,
  type Reducer,
} from "react";
import styles from "./page.module.css";
import { focusNextEmptyInput } from "@/utils/focus";
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
// - Timer (pause when not focused)
// - Letter frequency
// - Give up (reveal all)
// - Hint (reveal letter)
// - Loading state - improvement
// -- random placeholder elements of random length
// - Improve overall visuals
// - Improve win condition visuals
// - backspace empty input should focus previous input
// - display tags and allow filtering by tag

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
  const quoteRef = useRef<HTMLDivElement>(null);

  async function newGame() {
    dispatch({ type: ActionType.Loading });
    const { quote, author } = await getQuote();
    dispatch({ type: ActionType.NewGame, payload: { quote, author } });
  }

  function clearBoard() {
    dispatch({ type: ActionType.Clear });
  }

  function updateAnswer(e: ChangeEvent<HTMLInputElement>) {
    if (/[a-zA-Z]/.test(e.target.value)) {
      dispatch({
        type: ActionType.SetAnswer,
        payload: { encoded: e.target.name, decoded: e.target.value },
      });

      if (e.target.value && quoteRef.current) {
        window.requestAnimationFrame(() =>
          focusNextEmptyInput(quoteRef.current)
        );
      }
    }
  }

  function focusLetter(e: FocusEvent<HTMLInputElement>) {
    dispatch({ type: ActionType.SetCurrentLetter, payload: e.target.name });
  }

  useEffect(() => {
    (async function start() {
      await newGame();
    })();
  }, []);

  return (
    <main>
      <h1>Cryptoquote</h1>

      <button onClick={newGame}>New game</button>
      <button onClick={clearBoard}>Clear</button>

      {state.win && <div>🎉 You Won! 🎉</div>}

      <div ref={quoteRef} className={styles.quote}>
        {state.loading ? (
          <span>loading...</span>
        ) : (
          state.encryptedQuote
            .split(/\s+/)
            .map((word: string, wordIdx: number) => (
              <Word key={`word-${word}-${wordIdx}`}>
                {word.split("").map((char: string, charIdx: number) => (
                  <Letter
                    key={`letter-${wordIdx}-${charIdx}`}
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
