"use client";

import { useState, type ChangeEvent } from "react";
import styles from "./page.module.css";
import { createCypher, cypherEncrypt, getAlphabetIndex } from "@/utils/cypher";

function Letter(props) {
  const { char, id } = props;
  const isAlpha = getAlphabetIndex(char) >= 0;

  return (
    <span className={styles.letter}>
      <input
        id={id}
        size={1}
        maxLength={1}
        className={styles.letterInput}
        name={char}
        onChange={props.onChange}
        value={isAlpha ? props.value : char}
        readOnly={!isAlpha}
        tabIndex={isAlpha ? 0 : -1}
      />
      <label htmlFor={id} className={styles.letterLabel}>
        {char}
      </label>
    </span>
  );
}

function Word(props) {
  return <span className={styles.word}>{props.children}</span>;
}

function focusNextLetter(currentId) {
  const nextNumber = parseInt(currentId.split("-")[1], 10) + 1;
  const nextId = `letter-${nextNumber}`;
  const nextInput = document.getElementById(nextId) as HTMLInputElement;

  if (nextInput) {
    if (nextInput.value || nextInput.hasAttribute("readonly")) {
      focusNextLetter(nextId);
    } else {
      nextInput.focus();
    }
  }
}

export default function Home() {
  const [cypher, setCypher] = useState([]);
  const [encryptedQuote, setEncryptedQuote] = useState("");
  const [encryptedAuthor, setEncryptedAuthor] = useState("");
  const [answerMap, setAnswerMap] = useState({});
  const quote = "That's one small step for a man, a giant leap for mankind.";
  const author = "Neil Armstrong";

  function restart() {
    const c = createCypher();
    setCypher(c);
    setEncryptedQuote(cypherEncrypt(quote, c));
    setEncryptedAuthor(cypherEncrypt(author, c));
    setAnswerMap(
      c.reduce((accumulator, letter) => {
        console.log(letter, accumulator);
        return { ...accumulator, [letter]: "" };
      }),
      {}
    );
  }

  function updateAnswer(e: ChangeEvent<HTMLInputElement>) {
    const name = e.target.name;
    const val = e.target.value;

    setAnswerMap((prev) => {
      return {
        ...prev,
        [name]: val.toUpperCase(),
      };
    });

    // Do this after the update goes through
    if (val) {
      focusNextLetter(e.target.id);
    }
  }

  return (
    <main>
      <h1>Cryptoquote</h1>

      <button onClick={restart}>Start over</button>

      <div>
        {encryptedQuote.split(/\s+/).map((word) => (
          <Word>
            {word.split("").map((char: string, i: number) => (
              <Letter
                key={`${char}-${i}`}
                id={`letter-${i}`}
                char={char}
                onChange={updateAnswer}
                value={answerMap[char]}
              />
            ))}
          </Word>
        ))}
      </div>
    </main>
  );
}
