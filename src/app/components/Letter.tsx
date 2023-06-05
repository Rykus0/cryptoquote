import { type ChangeEvent } from "react";
import { getAlphabetIndex } from "@/utils/cypher";
import styles from "./Letter.module.css";

interface LetterProps {
  char: string;
  id: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}

export default function Letter(props: LetterProps) {
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
