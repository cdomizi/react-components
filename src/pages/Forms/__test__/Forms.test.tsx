import { render, screen } from "@testing-library/react";
import { UncontrolledForm } from "../UncontrolledForm";
import userEvent from "@testing-library/user-event";

describe("Uncontrolled Form", () => {
  test("component renders correctly", () => {
    render(<UncontrolledForm />);

    const title = screen.getByRole("heading");
    const usernameField = screen.getByRole("textbox", { name: /username/i });
    const emailField = screen.getByRole("textbox", { name: /email/i });
    const fillWithRandomDataButton = screen.getByRole("button", {
      name: /fill with random data/i,
    });
    const submitButton = screen.getByRole("button", { name: /submit/i });

    expect(title).toMatch(/uncontrolled form/i);
    expect(usernameField).toBeInTheDocument();
    expect(emailField).toBeInTheDocument();
    expect(fillWithRandomDataButton).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();
  });

  test("required field", async () => {
    const user = userEvent.setup();

    render(<UncontrolledForm />);

    const usernameField = screen.getByRole("textbox", {
      name: /username/i,
    });
    const usernameFieldLabel = usernameField.parentElement;
    const submitButton = screen.getByRole("button", {
      name: /submit/i,
    });

    // No error displayed in the UI
    expect(usernameFieldLabel).not.toHaveClass("Mui-error");
    expect(() =>
      screen.getByText(/username must be at least 3 characters long/i),
    ).toThrow();

    // Submit the form without filling required field
    await user.click(submitButton);

    // Error displayed in the UI
    expect(usernameFieldLabel).toHaveClass("Mui-error");

    // Error helper text displayed
    const errorHelperText = screen.getByText(
      /username must be at least 3 characters long/i,
    );

    expect(errorHelperText).toBeInTheDocument();

    // Enter two characters in the `Username` field
    await user.type(usernameField, "Jo");

    // UI still displays error
    expect(usernameFieldLabel).toHaveClass("Mui-error");

    // Enter the third characters in the `Username` field
    await user.type(usernameField, "hn");

    // UI no more displays error
    expect(usernameField).toHaveValue("John");
    expect(usernameFieldLabel).not.toHaveClass("Mui-error");

    // Delete some characters from the `Username` to trigger the error again
    await user.type(usernameField, "{backspace}{backspace}");

    // UI displays error again
    expect(usernameField).toHaveValue("Jo");
    expect(usernameFieldLabel).toHaveClass("Mui-error");
  });

  test("email field wrong format", async () => {
    const user = userEvent.setup();

    render(<UncontrolledForm />);

    const emailField = screen.getByRole("textbox", {
      name: /email/i,
    });
    const emailFieldLabel = emailField.parentElement;
    const submitButton = screen.getByRole("button", {
      name: /submit/i,
    });

    // No error displayed in the UI
    expect(emailFieldLabel).not.toHaveClass("Mui-error");

    // Enter a wrong formatted email address
    await user.type(emailField, "john.doe@example");

    // Submit the form without filling required field
    await user.click(submitButton);

    // UI displays error
    expect(emailField).toHaveValue("john.doe@example");
    expect(emailFieldLabel).toHaveClass("Mui-error");

    // Type an email address with the correct format
    await user.type(emailField, ".com");

    // UI displays no error
    expect(emailField).toHaveValue("john.doe@example.com");
    expect(emailFieldLabel).not.toHaveClass("Mui-error");
  });
});
