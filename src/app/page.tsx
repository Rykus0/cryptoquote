"use client";

import { useState, type ChangeEvent, type FocusEvent } from "react";
import styles from "./page.module.css";
import { createCypher, cypherEncrypt, getAlphabetIndex } from "@/utils/cypher";
import Letter from "./components/Letter";
import Word from "./components/Word";

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

export default function Home() {
  const [cypher, setCypher] = useState([]);
  const [encryptedQuote, setEncryptedQuote] = useState("");
  const [encryptedAuthor, setEncryptedAuthor] = useState("");
  const [answerMap, setAnswerMap] = useState({});
  const [currentLetter, setCurrentLetter] = useState("");
  const [currentIdx, setCurrentIdx] = useState();

  const quote = "That's one small step for a man, a giant leap for mankind.";
  const author = "Neil Armstrong";

  function restart() {
    const c = createCypher();
    setCypher(c);
    setEncryptedQuote(cypherEncrypt(quote, c));
    setEncryptedAuthor(cypherEncrypt(author, c));
    setAnswerMap(
      c.reduce((accumulator, letter) => ({ ...accumulator, [letter]: "" })),
      {}
    );
    setCurrentLetter("");
  }

  function updateAnswer(e: ChangeEvent<HTMLInputElement>) {
    const name = e.target.name;
    const val = e.target.value;

    setAnswerMap((prev: Object) => {
      return {
        ...prev,
        [name]: val.toUpperCase(),
      };
    });

    // Do this after the update goes through
    if (val) {
      window.requestAnimationFrame(() => focusNextLetter(e.target.id));
    }
  }

  function focusLetter(e: FocusEvent<HTMLInputElement>) {
    setCurrentLetter(e.target.name);
  }

  return (
    <main>
      <h1>Cryptoquote</h1>

      <button onClick={restart}>Start over</button>

      <div className={styles.quote}>
        {encryptedQuote.split(/\s+/).map((word: string, wordIdx: number) => (
          <Word key={`word-${word}-${wordIdx}`}>
            {word.split("").map((char: string, charIdx: number) => (
              <Letter
                key={createLetterId(wordIdx, charIdx)}
                id={createLetterId(wordIdx, charIdx)}
                char={char}
                onChange={updateAnswer}
                onFocus={focusLetter}
                focused={currentLetter === char}
                value={answerMap[char]}
              />
            ))}
          </Word>
        ))}
      </div>
    </main>
  );
}
