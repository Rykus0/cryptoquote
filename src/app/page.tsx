"use client";

import {
  useCallback,
  useEffect,
  useReducer,
  useRef,
  type ChangeEvent,
  type FocusEvent,
  type KeyboardEvent,
  type Reducer,
} from "react";
import styles from "./page.module.css";
import { focusNextEmptyInput, focusPreviousInput } from "@/utils/focus";
import Confetti from "@/app/components/Confetti";
import Controls from "@/app/components/Controls";
import Letter from "@/app/components/Letter";
import Placeholder from "@/app/components/Placeholder";
import Timer from "@/app/components/Timer";
import Word from "@/app/components/Word";
import reducer, { initialState } from "@/app/state/reducer";
import { ActionType, type State, type Action } from "@/app/state/types";

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

  function revealCurrent() {
    // dispatch({ type: ActionType.GiveUp });
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

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (
      quoteRef.current &&
      e.currentTarget.value === "" &&
      e.key === "Backspace"
    ) {
      focusPreviousInput(quoteRef.current);
    }
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
        <h1>Cryptoquotle</h1>
      </header>

      <Controls
        gameOff={state.win || state.loading || false}
        msElapsed={state.msElapsed}
        onNewGame={newGame}
        onClear={clearBoard}
        onRevealAll={revealAll}
        onRevealCurrent={revealCurrent}
      />

      <div className={styles.timer}>
        <Timer ms={state.msElapsed} />
      </div>

      {state.completeWithError && (
        <p>
          <b>So close!</b> There is at least one mistake.
        </p>
      )}

      {state.win ? (
        <div>
          <Confetti />
          <figure className={styles.winQuote}>
            <blockquote>{state.quote}</blockquote>
            <figcaption>&mdash; {state.author}</figcaption>
          </figure>
        </div>
      ) : (
        <div ref={quoteRef} className={styles.quote}>
          {state.loading ? (
            <>
              <Placeholder height="4em" />
              <Placeholder height="4em" />
              <Placeholder height="4em" />
            </>
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
                      onKeyDown={handleKeyDown}
                      highlighted={state.currentLetter === char}
                      value={state.answerCypher.get(char)}
                    />
                  ))}
                </Word>
              ))
          )}
        </div>
      )}
    </main>
  );
}
