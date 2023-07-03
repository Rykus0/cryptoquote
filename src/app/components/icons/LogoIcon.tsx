import { memo } from "react";
import styles from "./LogoIcon.module.css";

export function LogoIcon() {
  return (
    <svg
      viewBox="0 0 128 128"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={styles.logoIcon}
      role="img"
      aria-hidden="true"
    >
      <title>Cryptoquotle Logo</title>
      <circle cx="56" cy="53" r="36" stroke="black" strokeWidth="12" />
      <rect
        x="74.3684"
        y="59.5534"
        width="60"
        height="12"
        transform="rotate(54.5202 74.3684 59.5534)"
      />
      <rect
        x="108.875"
        y="108.593"
        width="25"
        height="8"
        transform="rotate(144.52 108.875 108.593)"
      />
      <rect
        x="95.0208"
        y="98.866"
        width="24"
        height="8"
        transform="rotate(144.52 95.0208 98.866)"
      />
      <mask
        id="mask0_1_2"
        style={{ maskType: "alpha" }}
        maskUnits="userSpaceOnUse"
        x="23"
        y="25"
        width="53"
        height="56"
      >
        <path d="M23 25H76L56 53L76 81H56H23V25Z" />
      </mask>
      <g mask="url(#mask0_1_2)">
        <circle cx="56" cy="53" r="22" strokeWidth="12" />
      </g>
    </svg>
  );
}

export default memo(LogoIcon);
