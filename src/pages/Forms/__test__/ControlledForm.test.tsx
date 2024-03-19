import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as utils from "utils/getRandomData";
import { ControlledForm } from "../ControlledForm";

describe("Controlled form", () => {
  test("component renders correctly", () => {
    render(<ControlledForm />);

    const title = screen.getByRole("heading");
    const usernameField = screen.getByRole("textbox", { name: /username/i });
    const emailField = screen.getByRole("textbox", { name: /email/i });
    const fillWithRandomDataButton = screen.getByRole("button", {
      name: /fill with random data/i,
    });
    const submitButton = screen.getByRole("button", { name: /submit/i });

    expect(title).toHaveTextContent(/controlled form/i);
    expect(usernameField).toBeInTheDocument();
    expect(emailField).toBeInTheDocument();
    expect(fillWithRandomDataButton).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();
  });

  test("displays error on missing required field", async () => {
    const user = userEvent.setup();

    render(<ControlledForm />);

    const usernameField = screen.getByRole("textbox", { name: /username/i });
    const usernameFieldLabel = usernameField.parentElement;
    const submitButton = screen.getByRole("button", { name: /submit/i });
    const errorHelperTextContent =
      /username must be at least 3 characters long/i;

    // No error displayed in the UI
    expect(usernameFieldLabel).not.toHaveClass("Mui-error");
    expect(() => screen.getByText(errorHelperTextContent)).toThrow();

    // Submit the form with empty required field
    await user.click(submitButton);

    // Error displayed in the UI
    expect(usernameFieldLabel).toHaveClass("Mui-error");
    expect(usernameField).toHaveFocus();

    const errorHelperText = screen.getByText(errorHelperTextContent);

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

  test("validates email field correctly", async () => {
    const user = userEvent.setup();

    render(<ControlledForm />);

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

  test("fills form fields with random data", async () => {
    // Mock random data
    const randomUserData = {
      username: "johnDoe",
      email: "john.doe@example.com",
    };

    vi.spyOn(utils, "getRandomData").mockImplementation(
      () =>
        new Promise((resolve) => {
          setTimeout(() => {
            resolve(randomUserData);
          }, 50);
        }),
    );

    const user = userEvent.setup();

    render(<ControlledForm />);

    const usernameField = screen.getByRole("textbox", { name: /username/i });
    const emailField = screen.getByRole("textbox", { name: /email/i });
    const fillWithRandomDataButton = screen.getByRole("button", {
      name: /fill with random data/i,
    });
    const submitButton = screen.getByRole("button", { name: /submit/i });

    // Form fields are empty
    expect(usernameField).toHaveValue("");
    expect(emailField).toHaveValue("");

    // Fill the form with random data
    await user.click(fillWithRandomDataButton);

    // Form fields and buttons are disabled while loading
    expect(usernameField.parentElement).toHaveClass("Mui-disabled");
    expect(emailField.parentElement).toHaveClass("Mui-disabled");
    expect(fillWithRandomDataButton).toBeDisabled();
    expect(submitButton).toBeDisabled();

    // Form fields are filled with random data after loading
    await waitFor(() => {
      expect(usernameField).toHaveValue(randomUserData.username);
      expect(emailField).toHaveValue(randomUserData.email);
    });
  });

  test("submits form when submit button is clicked", async () => {
    const user = userEvent.setup();
    const logSpy = vi.spyOn(console, "log");

    render(<ControlledForm />);

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

  test("resets all form fields on submit", async () => {
    const user = userEvent.setup();

    render(<ControlledForm />);

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

    // Form fields reset to default after submit
    expect(usernameField).toHaveValue("");
    expect(emailField).toHaveValue("");
  });
});
