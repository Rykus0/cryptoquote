import { memo } from "react";
import styles from "./Placeholder.module.css";

type PlaceholderProps = {
  height?: string;
  width?: string;
};

export function Placeholder(props: PlaceholderProps) {
  return (
    <div
      role="status"
      aria-label="Content is loading"
      className={styles.placeholder}
      style={{
        width: props.width,
        height: props.height,
      }}
    />
  );
}

export default memo(Placeholder);
