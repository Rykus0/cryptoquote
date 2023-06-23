const random = Math.random;

export const colorThemes = [
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
