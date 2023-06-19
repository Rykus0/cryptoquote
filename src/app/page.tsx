"use client";

import {
  useCallback,
  useEffect,
  useReducer,
  useRef,
  type ChangeEvent,
  type FocusEvent,
  type Reducer,
} from "react";
import styles from "./page.module.css";
import { focusNextEmptyInput } from "@/utils/focus";
import Button from "@/app/components/Button";
import Confetti from "@/app/components/Confetti";
import Letter from "@/app/components/Letter";
import Timer from "@/app/components/Timer";
import Word from "@/app/components/Word";
import reducer, {
  initialState,
  ActionType,
  type State,
  type Action,
} from "@/app/state/reducer";

async function getQuote() {
  const response = await fetch("https://api.quotable.io/random");
  const data = await response.json();

  return {
    quote: data.content,
    author: data.author,
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

  function revealAll() {
    dispatch({ type: ActionType.GiveUp });
  }

  function updateAnswer(e: ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;

    if (/[a-zA-Z]/.test(value) || value === "") {
      dispatch({
        type: ActionType.SetAnswer,
        payload: { encoded: e.target.name, decoded: value },
      });

      if (value) {
        window.requestAnimationFrame(
          () => quoteRef.current && focusNextEmptyInput(quoteRef.current)
        );
      }
    }
  }

  function focusLetter(e: FocusEvent<HTMLInputElement>) {
    dispatch({ type: ActionType.SetCurrentLetter, payload: e.target.name });
  }

  const tick = useCallback(() => {
    dispatch({ type: ActionType.Tick, payload: Date.now() });

    if (!state.win) {
      setTimeout(tick, 100);
    }
  }, [state.win]);

  useEffect(() => {
    tick();
  }, [tick]);

  useEffect(() => {
    (async function start() {
      await newGame();
    })();
  }, []);

  return (
    <main>
      <header>
        <h1>Cryptoquote</h1>
      </header>
      <div className={styles.controls}>
        <Button onClick={newGame}>New game</Button>
        <Button onClick={clearBoard} disabled={state.win}>
          Clear
        </Button>
        <Button onClick={revealAll} disabled={state.win}>
          Give up
        </Button>
        <Timer ms={state.msElapsed} />
      </div>

      {state.win && <Confetti>🎉 You Won! 🎉</Confetti>}

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
                    occurrences={state.letterFrequency.get(char) || 0}
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
