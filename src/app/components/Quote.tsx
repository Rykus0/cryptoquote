import styles from "./Quote.module.css";

type QuoteProps = {
  quote: string;
  author: string;
};

export default function Quote(props: QuoteProps) {
  return (
    <div>
      <figure className={styles.quote}>
        <blockquote>{props.quote}</blockquote>
        <figcaption>&mdash; {props.author}</figcaption>
      </figure>
    </div>
  );
}
