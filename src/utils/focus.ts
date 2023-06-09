export function focusNextEmptyInput(container: HTMLDivElement) {
  const inputs = Array.from(container.querySelectorAll("input"));
  const current =
    inputs.indexOf(document.activeElement as HTMLInputElement) || 0;

  let next = current;

  do {
    next = (next + 1) % inputs.length;
  } while (inputs[next].value.length && next !== current);

  inputs[next].focus();
}
