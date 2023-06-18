import { type HTMLAttributes } from "react";
import styles from "./Button.module.css";

export default function Button(props: HTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={styles.button} onClick={props.onClick}>
      {props.children}
    </button>
  );
}
