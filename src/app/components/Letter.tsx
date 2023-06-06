import { type ChangeEvent, type FocusEvent } from "react";
import { getAlphabetIndex } from "@/utils/cypher";
import styles from "./Letter.module.css";

interface LetterProps {
  char: string;
  id: string;
  value?: string;
  focused?: boolean;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  onFocus?: (e: FocusEvent<HTMLInputElement>) => void;
}

export default function Letter(props: LetterProps) {
  const { char, id } = props;
  const isAlpha = getAlphabetIndex(char) >= 0;

  return (
    <span className={props.focused ? styles.focusedLetter : styles.letter}>
      <input
        id={id}
        className={styles.letterInput}
        size={1}
        maxLength={1}
        name={char}
        value={isAlpha ? props.value : char}
        onChange={props.onChange}
        onFocus={props.onFocus}
        readOnly={!isAlpha}
        tabIndex={isAlpha ? 0 : -1}
      />
      <label htmlFor={id} className={styles.letterLabel}>
        {char}
      </label>
    </span>
  );
}
