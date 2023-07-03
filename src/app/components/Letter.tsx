import {
  useId,
  memo,
  type ChangeEvent,
  type FocusEvent,
  type KeyboardEvent,
} from "react";
import styles from "./Letter.module.css";

interface LetterProps {
  char: string;
  value?: string;
  occurrences: number;
  highlighted?: boolean;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void;
  onFocus?: (e: FocusEvent<HTMLInputElement>) => void;
}

export function Letter(props: LetterProps) {
  const { char } = props;
  const isAlpha = /[a-zA-Z]/.test(char);
  const id = useId();

  function handleFocus(e: FocusEvent<HTMLInputElement>) {
    e.target.select();

    if (props.onFocus) {
      props.onFocus(e);
    }
  }

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
            onKeyDown={props.onKeyDown}
            onFocus={handleFocus}
          />
          <label htmlFor={id} className={styles.letterLabel}>
            {char}
          </label>
          <span aria-label="letter count" className={styles.letterCount}>
            {props.occurrences}
          </span>
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

export default memo(Letter);
