import { useId, type ChangeEvent, type FocusEvent } from "react";
import styles from "./Letter.module.css";

interface LetterProps {
  char: string;
  value?: string;
  highlighted?: boolean;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  onFocus?: (e: FocusEvent<HTMLInputElement>) => void;
}

export default function Letter(props: LetterProps) {
  const { char } = props;
  const isAlpha = /[a-zA-Z]/.test(char);
  const id = useId();

  return (
    <span className={props.highlighted ? styles.focusedLetter : styles.letter}>
      {isAlpha ? (
        <>
          <input
            id={id}
            className={styles.letterInput}
            size={1}
            maxLength={1}
            name={char}
            value={props.value}
            onChange={props.onChange}
            onFocus={props.onFocus}
          />
          <label htmlFor={id} className={styles.letterLabel}>
            {char}
          </label>
        </>
      ) : (
        <>
          <span className={styles.letter}>{char}</span>
          <span className={styles.letterLabel}>{char}</span>
        </>
      )}
    </span>
  );
}
