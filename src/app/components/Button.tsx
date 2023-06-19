import { type ButtonHTMLAttributes } from "react";
import styles from "./Button.module.css";

export default function Button(props: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={styles.button}
      onClick={props.onClick}
      disabled={props.disabled}
    >
      {props.children}
    </button>
  );
}
