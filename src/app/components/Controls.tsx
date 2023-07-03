import { memo } from "react";
import Button from "@/app/components/Button";
import styles from "./Controls.module.css";

type ControlsProps = {
  gameOff: boolean;
  msElapsed: number;

  onNewGame: () => void;
  onClear: () => void;
  onRevealAll: () => void;
};

export function Controls(props: ControlsProps) {
  return (
    <div className={styles.controls}>
      <Button onClick={props.onNewGame}>New game</Button>
      <Button onClick={props.onClear} disabled={props.gameOff}>
        Clear
      </Button>
      <Button onClick={props.onRevealAll} disabled={props.gameOff}>
        Give up
      </Button>
    </div>
  );
}

export default memo(Controls);
