import { memo } from "react";
import styles from "./Quote.module.css";

type QuoteProps = {
  quote: string;
  author?: string;
};

export function Quote(props: QuoteProps) {
  return (
    <figure className={styles.quote}>
      <blockquote>{props.quote}</blockquote>
      <figcaption>&mdash; {props.author ?? "Anonymous"}</figcaption>
    </figure>
  );
}

export default memo(Quote);
