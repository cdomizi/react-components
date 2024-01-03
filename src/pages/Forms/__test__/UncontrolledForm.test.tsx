import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { UncontrolledForm } from "../UncontrolledForm";

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

  test("required field validation", async () => {
    const user = userEvent.setup();

    render(<UncontrolledForm />);

    const usernameField = screen.getByRole("textbox", { name: /username/i });
    const usernameFieldLabel = usernameField.parentElement;
    const submitButton = screen.getByRole("button", { name: /submit/i });

    // No error displayed in the UI
    expect(usernameFieldLabel).not.toHaveClass("Mui-error");
    expect(() =>
      screen.getByText(/username must be at least 3 characters long/i),
    ).toThrow();

    // Submit the form with empty required field
    await user.click(submitButton);

    // Error displayed in the UI
    expect(usernameFieldLabel).toHaveClass("Mui-error");
    expect(usernameField).toHaveFocus();

    const errorHelperText = screen.getByText(
      /username must be at least 3 characters long/i,
    );

    // Error helper text displayed
    expect(errorHelperText).toBeInTheDocument();

    // Enter two characters in the `Username` field
    await user.type(usernameField, "Jo");

    // UI still displays error
    expect(usernameFieldLabel).toHaveClass("Mui-error");
    expect(usernameField).toHaveFocus();

    // Enter more characters in the username field
    await user.type(usernameField, "hn");

    // UI no more displays error
    expect(usernameField).toHaveValue("John");
    expect(usernameFieldLabel).not.toHaveClass("Mui-error");

    // Delete some characters from the `Username` to trigger the error again
    await user.type(usernameField, "{backspace}{backspace}");

    // UI displays error again
    expect(usernameField).toHaveValue("Jo");
    expect(usernameFieldLabel).toHaveClass("Mui-error");
    expect(usernameField).toHaveFocus();
  });

  test("email field validation", async () => {
    const user = userEvent.setup();

    render(<UncontrolledForm />);

    const usernameField = screen.getByRole("textbox", { name: /username/i });
    const emailField = screen.getByRole("textbox", { name: /email/i });
    const emailFieldLabel = emailField.parentElement;
    const submitButton = screen.getByRole("button", { name: /submit/i });

    // No error displayed in the UI
    expect(emailFieldLabel).not.toHaveClass("Mui-error");

    // Enter a wrong formatted email address
    await user.type(emailField, "john.doe@example");

    await user.click(submitButton);

    // UI displays error
    expect(emailField).toHaveValue("john.doe@example");
    expect(emailFieldLabel).toHaveClass("Mui-error");
    // When more fields have errors, focus is on the first one
    expect(usernameField).toHaveFocus();

    // Enter an email address with the correct format
    await user.type(emailField, ".com");

    // UI displays no error
    expect(emailField).toHaveValue("john.doe@example.com");
    expect(emailFieldLabel).not.toHaveClass("Mui-error");
  });

  test("form submission", async () => {
    const user = userEvent.setup();
    const logSpy = vi.spyOn(console, "log");

    render(<UncontrolledForm />);

    const usernameField = screen.getByRole("textbox", { name: /username/i });
    const emailField = screen.getByRole("textbox", { name: /email/i });
    const submitButton = screen.getByRole("button", { name: /submit/i });

    // Fill the form
    await user.type(usernameField, "johnDoe");
    await user.type(emailField, "john.doe@example.com");

    expect(usernameField).toHaveValue("johnDoe");
    expect(emailField).toHaveValue("john.doe@example.com");

    // Submit the form
    await user.click(submitButton);

    // Check form submitted values to match entered values
    expect(logSpy).toHaveBeenCalledOnce();
    expect(logSpy).toHaveBeenCalledWith({
      username: "johnDoe",
      email: "john.doe@example.com",
    });
  });
});
