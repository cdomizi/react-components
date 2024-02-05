import {
  getDefaultNormalizer,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { allUsers } from "mocks/data";
import { Logger } from "../Logger";

describe("logger", () => {
  test("renders provided value", async () => {
    const expectedValue = allUsers[0];
    const formattedText = JSON.stringify(expectedValue, undefined, 2);

    render(<Logger value={expectedValue} />);

    await waitFor(() => {
      const logValue = screen.getByText(formattedText, {
        normalizer: getDefaultNormalizer({
          trim: false,
          collapseWhitespace: false,
        }),
      });

      // eslint-disable-next-line jest-dom/prefer-to-have-text-content
      expect(logValue.textContent).toMatch(formattedText);
    });
  });
});
