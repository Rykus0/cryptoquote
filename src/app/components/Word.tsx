import {
  memo,
  type ChangeEvent,
  type FocusEvent,
  type KeyboardEvent,
} from "react";
import Letter from "@/app/components/Letter";
import styles from "./Word.module.css";

type WordProps = {
  value: string;
  letterFrequency: Map<string, number>;
  onLetterChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onLetterFocus: (e: FocusEvent<HTMLInputElement>) => void;
  onLetterKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
  currentLetter?: string;
  letterValues: Map<string, string>;
};

export function Word(props: WordProps) {
  return (
    <span className={styles.word}>
      {props.value.split("").map((char: string, charIdx: number) => (
        <Letter
          key={[props.value, "letter", char, charIdx].join("-")}
          char={char}
          occurrences={props.letterFrequency.get(char) || 1}
          onChange={props.onLetterChange}
          onFocus={props.onLetterFocus}
          onKeyDown={props.onLetterKeyDown}
          highlighted={props.currentLetter === char}
          value={props.letterValues.get(char)}
        />
      ))}
    </span>
  );
}

export default memo(Word);
