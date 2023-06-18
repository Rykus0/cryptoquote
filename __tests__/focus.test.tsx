import { cleanup, render } from "@testing-library/react";
import { focusNextEmptyInput } from "../src/utils/focus";

describe("focusNextEmptyInput", () => {
  afterEach(cleanup);

  it("should focus the next empty input", () => {
    const { getByTestId, getByLabelText } = render(
      <div data-testid="container">
        <label htmlFor="first">first</label>
        <input id="first" />
        <label htmlFor="second">second</label>
        <input id="second" />
        <label htmlFor="third">third</label>
        <input id="third" />
      </div>
    );

    getByLabelText("first").focus();

    focusNextEmptyInput(getByTestId("container") as HTMLDivElement);

    expect(document.activeElement).toBe(getByLabelText("second"));
  });

  it("should skip inputs with value", () => {
    const { getByTestId, getByLabelText } = render(
      <div data-testid="container">
        <label htmlFor="first">first</label>
        <input id="first" />
        <label htmlFor="second">second</label>
        <input id="second" defaultValue="sec" />
        <label htmlFor="third">third</label>
        <input id="third" />
      </div>
    );

    getByLabelText("first").focus();

    focusNextEmptyInput(getByTestId("container") as HTMLDivElement);

    expect(document.activeElement).toBe(getByLabelText("third"));
  });

  it("should wrap around to the first input if no empty inputs after current", () => {
    const { getByTestId, getByLabelText } = render(
      <div data-testid="container">
        <label htmlFor="first">first</label>
        <input id="first" />
        <label htmlFor="second">second</label>
        <input id="second" />
        <label htmlFor="third">third</label>
        <input id="third" defaultValue="value" />
      </div>
    );

    getByLabelText("second").focus();

    focusNextEmptyInput(getByTestId("container") as HTMLDivElement);

    expect(document.activeElement).toBe(getByLabelText("first"));
  });
});
