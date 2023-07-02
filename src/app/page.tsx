"use client";

import {
  useCallback,
  useEffect,
  useReducer,
  useRef,
  type ChangeEvent,
  type Reducer,
} from "react";
import Image from "next/image";
import reducer, { initialState } from "@/app/state/reducer";
import { ActionType, type Action, type State } from "@/app/state/types";
import Button from "@/app/components/Button";
import Confetti from "@/app/components/Confetti";
import Controls from "@/app/components/Controls";
import Cryptoquote from "@/app/components/Cryptoquote";
import Placeholder from "@/app/components/Placeholder";
import Share from "@/app/components/Share";
import Quote from "@/app/components/Quote";
import Timer from "@/app/components/Timer";
import styles from "./page.module.css";

async function getQuote() {
  try {
    const response = await fetch("https://api.quotable.io/random");
    const data = await response.json();

    return {
      quote: data.content,
      author: data.author,
    };
  } catch (error) {
    console.error(error);
  }

  return null;
}

export default function Home() {
  const [state, dispatch] = useReducer<Reducer<State, Action>>(
    reducer,
    initialState
  );
  const timer = useRef<ReturnType<typeof setInterval>>();

  async function newGame() {
    dispatch({ type: ActionType.Loading });
    const quoteData = await getQuote();

    if (quoteData) {
      dispatch({ type: ActionType.NewGame, payload: quoteData });
    } else {
      dispatch({ type: ActionType.LoadError });
    }
  }

  function clearBoard() {
    dispatch({ type: ActionType.Clear });
  }

  function revealAll() {
    dispatch({ type: ActionType.GiveUp });
  }

  function revealCurrent() {
    // dispatch({ type: ActionType.RevealCurrent });
  }

  function updateAnswer(e: ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;

    if (/[a-zA-Z]/.test(value) || value === "") {
      dispatch({
        type: ActionType.SetAnswer,
        payload: { encoded: e.target.name, decoded: value },
      });
    }
  }

  const tick = useCallback(() => {
    dispatch({ type: ActionType.Tick, payload: Date.now() });
  }, []);

  useEffect(() => {
    timer.current = setInterval(tick, 100);

    return () => {
      window.clearInterval(timer.current);
      timer.current = undefined;
    };
  }, [tick]);

  useEffect(() => {
    (async function start() {
      await newGame();
    })();
  }, []);

  return (
    <main>
      <Controls
        gameOff={state.win || state.loading || state.error}
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
        <p role="alert" aria-live="polite">
          <b>So close!</b> There is at least one mistake.
        </p>
      )}

      {state.win ? (
        <div>
          <Confetti />
          <Quote quote={state.quote} author={state.author} />
          <Share content={`${state.quote} — ${state.author}`} />
        </div>
      ) : (
        <>
          {state.loading ? (
            <div className={styles.placeholder}>
              <Placeholder height="4em" />
              <Placeholder height="4em" />
              <Placeholder height="4em" />
            </div>
          ) : (
            <>
              {state.error ? (
                <p role="alert">
                  There was an error getting the quote.{" "}
                  <Button onClick={newGame}>Try again</Button>
                </p>
              ) : (
                <Cryptoquote
                  quote={state.quote}
                  author={state.author}
                  cypher={state.cypher}
                  userCypher={state.answerCypher}
                  onLetterChange={updateAnswer}
                />
              )}
            </>
          )}
        </>
      )}
    </main>
  );
}
