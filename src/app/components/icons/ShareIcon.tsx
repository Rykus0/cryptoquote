import { memo } from "react";

export function ShareIcon() {
  return (
    <svg
      viewBox="0 0 128 128"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      role="img"
      aria-hidden="true"
    >
      <title>Share</title>
      <path
        d="M41 49H15C12.2386 49 10 51.2386 10 54V113C10 115.761 12.2386 118 15 118H113C115.761 118 118 115.761 118 113V54C118 51.2386 115.761 49 113 49H88"
        stroke="currentColor"
        strokeWidth="10"
      />
      <path
        d="M64 82L64 45.5L64 9M64 9L43.5 29.5M64 9L84.5 29.5"
        stroke="currentColor"
        strokeWidth="10"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default memo(ShareIcon);
