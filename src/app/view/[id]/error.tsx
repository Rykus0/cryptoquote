"use client";

import { useEffect } from "react";
import Link from "next/link";

type ErrorProps = {
  error: Error;
  reset: () => void;
};

export default function ViewError(Props: ErrorProps) {
  useEffect(() => {
    console.error(Props.error);
  }, [Props.error]);

  return (
    <>
      <h2>Quote failed to load</h2>
      <p>{Props.error.message}</p>
      <p>
        <Link href="/">Return to game</Link>
      </p>
    </>
  );
}
