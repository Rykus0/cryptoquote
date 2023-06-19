// From https://codepen.io/bananascript/pen/EyZeWm?editors=0010

import { useEffect, useRef, type PropsWithChildren } from "react";
import styles from "./Confetti.module.css";

const random = Math.random;
const cos = Math.cos;
const sin = Math.sin;
const PI = Math.PI;
const PI2 = PI * 2;

const spread = 40;
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

// Create a 1D Maximal Poisson Disc over [0, 1]
const radius = 1 / eccentricity;
const radius2 = radius + radius;

export default function Confetti(props: PropsWithChildren) {
  const container = useRef<HTMLDivElement>(null);
  const timer = useRef<NodeJS.Timeout | undefined>(undefined);
  const frame = useRef<number | undefined>(undefined);

  useEffect(() => {
    let confetti: Confetto[] = [];

    if (container.current && !frame.current) {
      // Add confetti
      let theme = colorThemes[0];

      (function addConfetto() {
        let confetto = new Confetto(theme);
        console.log(confetto);
        confetti.push(confetto);
        container.current.appendChild(confetto.outer);
        timer.current = setTimeout(addConfetto, spread * random());
      })();

      // Start the loop
      let prev: number | undefined = undefined;
      requestAnimationFrame(function loop(timestamp) {
        let delta = prev ? timestamp - prev : 0;
        prev = timestamp;
        let height = window.innerHeight;

        for (let i = confetti.length - 1; i >= 0; --i) {
          if (confetti[i].update(height, delta)) {
            container.current?.removeChild(confetti[i].outer);
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
  }, [container]);

  return (
    <div ref={container} className={styles.confetti}>
      {props.children}
    </div>
  );
}

class Confetto {
  private frame: number = 0;
  outer: HTMLDivElement = document.createElement("div");
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
  // domain is the set of points which are still available to pick from
  // D = union{ [d_i, d_i+1] | i is even }
  let domain = [radius, 1 - radius];
  let measure = 1 - radius2;
  let spline = [0, 1];

  while (measure) {
    let dart = measure * random();
    let i;
    let l;
    let interval;
    let a;
    let b;
    let c;
    let d;

    // Find where dart lies
    for (i = 0, l = domain.length, measure = 0; i < l; i += 2) {
      a = domain[i];
      b = domain[i + 1];
      interval = b - a;

      if (dart < measure + interval) {
        dart += a - measure;
        spline.push(dart);
        break;
      }
      measure += interval;
    }
    c = dart - radius;
    d = dart + radius;

    // Update the domain
    for (i = domain.length - 1; i > 0; i -= 2) {
      l = i - 1;
      a = domain[l];
      b = domain[i];

      // c---d          c---d  Do nothing
      //   c-----d  c-----d    Move interior
      //   c--------------d    Delete interval
      //         c--d          Split interval
      //       a------b
      if (a >= c && a < d)
        if (b > d) domain[l] = d; // Move interior (Left case)
        else domain.splice(l, 2);
      // Delete interval
      else if (a < c && b > c)
        if (b <= d) domain[i] = c; // Move interior (Right case)
        else domain.splice(i, 0, c, d); // Split interval
    }

    // Re-measure the domain
    for (i = 0, l = domain.length, measure = 0; i < l; i += 2) {
      measure += domain[i + 1] - domain[i];
    }
  }

  return spline.sort((a, b) => a - b);
}

// Cosine interpolation
function interpolation(a: number, b: number, t: number) {
  return ((1 - cos(PI * t)) / 2) * (b - a) + a;
}
