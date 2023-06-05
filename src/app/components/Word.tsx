import { type PropsWithChildren } from "react";
import styles from "./Word.module.css";

export default function Word(props: PropsWithChildren) {
  return <span className={styles.word}>{props.children}</span>;
}
