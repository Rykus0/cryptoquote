"use client";

import { useState, type ChangeEvent } from "react";
import styles from "./page.module.css";
import { createCypher, cypherEncrypt, getAlphabetIndex } from "@/utils/cypher";
import Letter from "./components/Letter";
import Word from "./components/Word";

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

      <div className={styles.quote}>
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
