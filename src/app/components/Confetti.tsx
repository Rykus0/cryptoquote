// From https://codepen.io/bananascript/pen/EyZeWm?editors=0010

import { useEffect, useRef } from "react";
import styles from "./Confetti.module.css";

const random = Math.random;
const cos = Math.cos;
const sin = Math.sin;
const PI = Math.PI;
const PI2 = PI * 2;

const defaultSpread = 40;
const sizeMin = 3;
const sizeMax = 12 - sizeMin;
const eccentricity = 10;
const deviation = 100;
const dxThetaMin = -0.1;
const dxThetaMax = -dxThetaMin - dxThetaMin;
const dyMin = 0.13;
const dyMax = 0.18;
const dThetaMin = 0.4;
const dThetaMax = 0.7 - dThetaMin;

const colorThemes = [
  function () {
    return color(
      (200 * random()) | 0,
      (200 * random()) | 0,
      (200 * random()) | 0
    );
  },
  function () {
    const black = (200 * random()) | 0;
    return color(200, black, black);
  },
  function () {
    const black = (200 * random()) | 0;
    return color(black, 200, black);
  },
  function () {
    const black = (200 * random()) | 0;
    return color(black, black, 200);
  },
  function () {
    return color(200, 100, (200 * random()) | 0);
  },
  function () {
    return color((200 * random()) | 0, 200, 200);
  },
  function () {
    const black = (256 * random()) | 0;
    return color(black, black, black);
  },
  function (): string {
    return colorThemes[random() < 0.5 ? 1 : 2]();
  },
  function (): string {
    return colorThemes[random() < 0.5 ? 3 : 5]();
  },
  function (): string {
    return colorThemes[random() < 0.5 ? 2 : 4]();
  },
];

function color(r: number, g: number, b: number) {
  return "rgb(" + r + "," + g + "," + b + ")";
}

type ConfettiProps = {
  spread?: number;
};

export default function Confetti(props: ConfettiProps) {
  const { spread = defaultSpread } = props;
  const container = useRef<HTMLDivElement>(null);
  const timer = useRef<NodeJS.Timeout | undefined>(undefined);
  const frame = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (container.current && !frame.current) {
      let confetti: Confetto[] = populateConfetti(
        container.current,
        spread,
        colorThemes[0]
      );

      // Start the loop
      let prev: number | undefined = undefined;
      requestAnimationFrame(function loop(timestamp) {
        let delta = prev ? timestamp - prev : 0;
        prev = timestamp;
        let height = window.innerHeight;

        for (let i = confetti.length - 1; i >= 0; --i) {
          if (confetti[i].update(height, delta)) {
            container.current?.removeChild(confetti[i].element);
            confetti.splice(i, 1);
          }
        }

        if (timer.current || confetti.length) {
          frame.current = requestAnimationFrame(loop);
          return frame;
        }

        // Cleanup
        if (container.current) {
          document.body.removeChild(container.current);
        }
        frame.current = undefined;
      });
    }

    return () => {
      timer.current = undefined;
      frame.current = undefined;
    };
  }, [container, spread]);

  return <div ref={container} className={styles.confetti} />;
}

function populateConfetti(
  container: HTMLDivElement,
  spread: number,
  theme: () => string
) {
  let timer: NodeJS.Timeout | undefined = undefined;
  const confetti: Confetto[] = [];

  (function addConfetto() {
    if (container) {
      let confetto = new Confetto(theme);
      confetti.push(confetto);
      container.appendChild(confetto.element);
      timer = setTimeout(addConfetto, spread * random());
    }
  })();

  return confetti;
}

class Confetto {
  private frame: number = 0;
  private outer: HTMLDivElement = document.createElement("div");
  private inner: HTMLDivElement = document.createElement("div");
  private axis: string =
    "rotate3D(" + cos(360 * random()) + "," + cos(360 * random()) + ",0,";
  private theta: number = 360 * random();
  private dTheta: number = dThetaMin + dThetaMax * random();
  private x: number = window.innerWidth * random();
  private y: number = -deviation;
  private dx: number = sin(dxThetaMin + dxThetaMax * random());
  private dy: number = dyMin + dyMax * random();
  private splineX: number[] = createPoisson();
  private splineY: number[] = [];

  constructor(theme: () => string) {
    this.outer.appendChild(this.inner);

    let outerStyle = this.outer.style;
    let innerStyle = this.inner.style;

    outerStyle.position = "absolute";
    outerStyle.width = sizeMin + sizeMax * random() + "px";
    outerStyle.height = sizeMin + sizeMax * random() + "px";

    innerStyle.width = "100%";
    innerStyle.height = "100%";
    innerStyle.backgroundColor = theme();

    outerStyle.perspective = "50px";
    outerStyle.transform = "rotate(" + 360 * random() + "deg)";

    innerStyle.transform = this.axis + this.theta + "deg)";

    outerStyle.left = this.x + "px";
    outerStyle.top = this.y + "px";

    // Create the periodic spline
    const length = this.splineX.length - 1;
    for (let i = 1; i < length; ++i) {
      this.splineY[i] = deviation * random();
    }
    this.splineY[0] = this.splineY[length] = deviation * random();
  }

  get element() {
    return this.outer;
  }

  update(height: number, delta: number) {
    this.frame += delta;
    this.x += this.dx * delta;
    this.y += this.dy * delta;
    this.theta += this.dTheta * delta;

    // Compute spline and convert to polar
    let phi = (this.frame % 7777) / 7777;
    let i = 0;
    let j = 1;

    while (phi >= this.splineX[j]) i = j++;
    let rho = interpolation(
      this.splineY[i],
      this.splineY[j],
      (phi - this.splineX[i]) / (this.splineX[j] - this.splineX[i])
    );
    phi *= PI2;

    let outerStyle = this.outer.style;
    let innerStyle = this.inner.style;
    outerStyle.left = this.x + rho * cos(phi) + "px";
    outerStyle.top = this.y + rho * sin(phi) + "px";
    innerStyle.transform = this.axis + this.theta + "deg)";
    return this.y > height + deviation;
  }
}

function createPoisson() {
  // Create a 1D Maximal Poisson Disc over [0, 1]
  const radius = 1 / eccentricity;
  const radius2 = radius + radius;

  // domain is the set of points which are still available to pick from
  // D = union{ [d_i, d_i+1] | i is even }
  let domain = [radius, 1 - radius];
  let measure = 1 - radius2;
  let spline = [0, 1];

  while (measure) {
    const dart = findDart(domain, measure * random());
    spline.push(dart);

    domain = updateDomain(domain, dart, radius);

    measure = measureDomain(domain);
  }

  return spline.sort((a, b) => a - b);
}

function findDart(domain: number[], start: number) {
  let dart = start;
  let measure = 0;
  let length = domain.length;
  let interval;

  for (let i = 0; i < length; i += 2) {
    const a = domain[i];
    const b = domain[i + 1];
    interval = b - a;

    if (dart < measure + interval) {
      dart += a - measure;
      break;
    }
    measure += interval;
  }

  return dart;
}

function updateDomain(domain: number[], dart: number, radius: number) {
  let updatedDomain = [...domain];
  const c = dart - radius;
  const d = dart + radius;

  for (let i = updatedDomain.length - 1; i > 0; i -= 2) {
    const l = i - 1;
    const a = updatedDomain[l];
    const b = updatedDomain[i];

    // c---d          c---d  Do nothing
    //   c-----d  c-----d    Move interior
    //   c--------------d    Delete interval
    //         c--d          Split interval
    //       a------b
    if (a >= c && a < d) {
      if (b > d) {
        updatedDomain[l] = d; // Move interior (Left case)
      } else {
        updatedDomain.splice(l, 2);
      }
    } else if (a < c && b > c) {
      // Delete interval
      if (b <= d) {
        updatedDomain[i] = c; // Move interior (Right case)
      } else {
        updatedDomain.splice(i, 0, c, d); // Split interval
      }
    }
  }

  return updatedDomain;
}

function measureDomain(domain: number[]) {
  let measure = 0;
  let length = domain.length;

  for (let i = 0; i < length; i += 2) {
    measure += getDomainInterval(domain, i);
  }

  return measure;
}

function getDomainInterval(domain: number[], index: number) {
  return domain[index + 1] - domain[index];
}

// Cosine interpolation
function interpolation(a: number, b: number, t: number) {
  return ((1 - cos(PI * t)) / 2) * (b - a) + a;
}
