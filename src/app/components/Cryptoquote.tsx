import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FocusEvent,
  type KeyboardEvent,
} from "react";
import { applyCypher } from "@/utils/cypher";
import { normalizeQuote, getLetterFrequencies } from "@/utils/formatting";
import { focusNextEmptyInput, focusPreviousInput } from "@/utils/focus";
import Word from "@/app/components/Word";
import styles from "./Cryptoquote.module.css";

type CryptoquoteProps = {
  loading?: boolean;
  quote: string;
  author: string;
  cypher: Map<string, string>;
  currentLetter?: string;
  userCypher: Map<string, string>;
  onLetterChange: (e: ChangeEvent<HTMLInputElement>) => void;
};

export default function Cryptoquote(props: CryptoquoteProps) {
  const quoteRef = useRef<HTMLDivElement>(null);
  const [encryptedQuote, setEncryptedQuote] = useState<string>("");
  const [encryptedAuthor, setEncryptedAuthor] = useState<string>("");
  const [letterFrequency, setLetterFrequency] = useState<Map<string, number>>(
    new Map()
  );
  const [currentLetter, setCurrentLetter] = useState<string>("");

  function onLetterFocus(e: FocusEvent<HTMLInputElement>) {
    setCurrentLetter(e.target.name);
  }

  function onLetterChange(e: ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;

    if (/[a-zA-Z]/.test(value) || value === "") {
      if (value) {
        window.requestAnimationFrame(
          () => quoteRef.current && focusNextEmptyInput(quoteRef.current)
        );
      }
    }

    if (props.onLetterChange) {
      props.onLetterChange(e);
    }
  }

  function onLetterKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (
      quoteRef.current &&
      e.currentTarget.value === "" &&
      e.key === "Backspace"
    ) {
      focusPreviousInput(quoteRef.current);
    }
  }

  useEffect(() => {
    setEncryptedQuote(applyCypher(normalizeQuote(props.quote), props.cypher));
    setEncryptedAuthor(applyCypher(normalizeQuote(props.author), props.cypher));
  }, [props.cypher, props.quote, props.author]);

  useEffect(() => {
    setLetterFrequency(getLetterFrequencies(encryptedQuote + encryptedAuthor));
  }, [encryptedQuote, encryptedAuthor]);

  return (
    <div ref={quoteRef} className={styles.quote}>
      {
        <>
          {encryptedQuote.split(/\s+/).map((word: string, wordIdx: number) => (
            <Word
              key={["quote", "word", word, wordIdx].join("-")}
              value={word}
              letterFrequency={letterFrequency}
              onLetterChange={onLetterChange}
              onLetterFocus={onLetterFocus}
              onLetterKeyDown={onLetterKeyDown}
              currentLetter={currentLetter}
              letterValues={props.userCypher}
            />
          ))}
          —
          {encryptedAuthor.split(/\s+/).map((word: string, wordIdx: number) => (
            <Word
              key={["author", "word", word, wordIdx].join("-")}
              value={word}
              letterFrequency={letterFrequency}
              onLetterChange={onLetterChange}
              onLetterFocus={onLetterFocus}
              onLetterKeyDown={onLetterKeyDown}
              currentLetter={currentLetter}
              letterValues={props.userCypher}
            />
          ))}
        </>
      }
    </div>
  );
}
