import { memo } from "react";
import styles from "./Timer.module.css";

type TimerProps = {
  ms: number;
};

export function Timer(props: TimerProps) {
  const { hours, minutes, seconds } = getHMSFromMs(props.ms);

  return (
    <time
      dateTime={`${hours}h ${minutes}m ${seconds}s`}
      className={styles.timer}
    >
      {getPaddedNumber(hours)}:{getPaddedNumber(minutes)}:
      {getPaddedNumber(seconds)}
    </time>
  );
}

function getHMSFromMs(ms: number) {
  const hours = Math.floor(ms / 1000 / 60 / 60);
  const minutes = Math.floor((ms / 1000 / 60) % 60);
  const seconds = Math.floor((ms / 1000) % 60);

  return { hours, minutes, seconds };
}

function getPaddedNumber(num: number) {
  return num.toString().padStart(2, "0");
}

export default memo(Timer);
