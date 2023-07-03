"use client";

import { useState, memo } from "react";
import Button from "@/app/components/Button";
import ShareIcon from "@/app/components/icons/ShareIcon";

type ShareProps = {
  content: string;
};

export function Share(props: ShareProps) {
  const [message, setMessage] = useState<string>("");

  async function share() {
    const shareData = {
      title: `I decyphered this quote!`,
      text: props.content,
      url: window.location.href,
    };

    setMessage("");

    try {
      await navigator.share(shareData);
      setMessage("Content shared successfully");
    } catch (err) {
      try {
        await navigator.clipboard.writeText(
          `${props.content} \n\n ${window.location.href}`
        );
        setMessage("Content copied to clipboard");
      } catch (err) {
        setMessage(
          `Error sharing content - please copy manually: ${window.location.href}`
        );
        console.error(err);
      }
    }
  }

  return (
    <div>
      <Button onClick={share}>
        <ShareIcon />
        Share
      </Button>
      <p role="status" aria-live="polite">
        {message}
      </p>
    </div>
  );
}

export default memo(Share);
