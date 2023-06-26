// From https://codepen.io/bananascript/pen/EyZeWm?editors=0010
// which is a fork of https://codepen.io/Pillowfication/pen/PNEJbY

import { useEffect, useRef } from "react";
import styles from "./Confetti.module.css";
import Confetto from "./Confetto";
import { colorThemes } from "./colorThemes";

const random = Math.random;
const defaultSpread = 40;
const theme = colorThemes[0];

type ConfettiProps = {
  spread?: number;
};

export default function Confetti(props: ConfettiProps) {
  const { spread = defaultSpread } = props;
  const container = useRef<HTMLDivElement>(null);
  const confetti = useRef<Confetto[]>([]);

  useEffect(() => {
    const containerEl = container.current;

    if (containerEl) {
      (function addConfetto() {
        if (document.contains(containerEl)) {
          let confetto = new Confetto(theme);
          confetti.current.push(confetto);
          containerEl.appendChild(confetto.element);
          setTimeout(addConfetto, spread * random());
        }
      })();

      updateConfetti(confetti.current, containerEl);
    }

    return () => {
      if (containerEl && document.body.contains(containerEl)) {
        document.body.removeChild(containerEl);
      }
    };
  }, [container, spread]);

  return <div ref={container} className={styles.confetti} />;
}

function updateConfetti(confetti: Confetto[], container: HTMLDivElement) {
  let prev: number | undefined = undefined;

  requestAnimationFrame(function loop(timestamp) {
    let delta = prev ? timestamp - prev : 0;
    prev = timestamp;
    let height = window.innerHeight;

    for (let i = confetti.length - 1; i >= 0; --i) {
      if (!document.contains(container) || confetti[i].update(height, delta)) {
        container.removeChild(confetti[i].element);
        confetti.splice(i, 1);
      }
    }

    if (container && document.contains(container) && confetti.length) {
      requestAnimationFrame(loop);
      return;
    }

    // Cleanup
    if (container && document.contains(container)) {
      document.body.removeChild(container);
    }
  });
}
