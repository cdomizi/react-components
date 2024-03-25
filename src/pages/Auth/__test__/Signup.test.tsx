import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import Home from "pages/Home";
import Login from "../Login";
import Signup from "../Signup";

const MockRoutes = () => (
  <Routes>
    <Route path="/">
      <Route index element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
    </Route>
  </Routes>
);

const MockRouter = ({ initialEntries }: { initialEntries?: string[] }) => (
  <MemoryRouter {...(initialEntries?.length && { initialEntries })}>
    <MockRoutes />
  </MemoryRouter>
);

describe("signup page", () => {
  test("component renders correctly", () => {
    render(<MockRouter initialEntries={["/signup"]} />);

    const title = screen.getByRole("heading");
    const usernameField = screen.getByRole("textbox", { name: /username/i });
    const passwordField = screen.getByLabelText(/^password/i);
    const confirmPasswordField = screen.getByLabelText(/confirm password/i);
    const signupButton = screen.getByRole("button", {
      name: /create an account/i,
    });
    const loginButton = screen.getByRole("button", { name: /log in/i });

    expect(title).toBeInTheDocument();
    expect(title).toHaveTextContent(/sign up/i);
    expect(usernameField).toBeInTheDocument();
    expect(passwordField).toBeInTheDocument();
    expect(confirmPasswordField).toBeInTheDocument();
    expect(loginButton).toBeInTheDocument();
    expect(signupButton).toBeInTheDocument();
  });

  test("displays error on missing required field", async () => {
    const user = userEvent.setup();

    render(<MockRouter initialEntries={["/signup"]} />);

    const signupButton = screen.getByRole("button", {
      name: /create an account/i,
    });
    // Username field
    const usernameField = screen.getByRole("textbox", {
      name: /username/i,
    });
    const usernameFieldLabel = usernameField.parentElement;
    const usernameErrorHelperTextContent =
      /username must be at least 3 characters long/i;
    // Password field
    const passwordField = screen.getByLabelText(/^password/i);
    const passwordFieldLabel = passwordField.parentElement;
    const passwordErrorHelperTextContent =
      /password must be at least 6 characters long/i;
    // Confirm Password field
    const confirmPasswordField = screen.getByLabelText(/confirm password/i);
    const confirmPasswordFieldLabel = passwordField.parentElement;

    // No error displayed in the UI
    expect(usernameFieldLabel).not.toHaveClass("Mui-error");
    expect(passwordFieldLabel).not.toHaveClass("Mui-error");
    expect(confirmPasswordField).not.toHaveClass("Mui-error");
    expect(() => screen.getByText(usernameErrorHelperTextContent)).toThrow();
    expect(() => screen.getByText(passwordErrorHelperTextContent)).toThrow();

    // Submit the form with empty required field
    await user.click(signupButton);

    await waitFor(() => {
      // UI displays errors
      expect(usernameFieldLabel).toHaveClass("Mui-error");
      expect(passwordFieldLabel).toHaveClass("Mui-error");
      expect(confirmPasswordFieldLabel).toHaveClass("Mui-error");
      // When more fields have errors, focus is on the first one
      expect(usernameField).toHaveFocus();

      const usernameErrorHelperText = screen.getByText(
        usernameErrorHelperTextContent,
      );
      const passwordErrorsHelperText = screen.getAllByText(
        passwordErrorHelperTextContent,
      );

      // Error helper text displayed
      expect(usernameErrorHelperText).toBeInTheDocument();
      expect(passwordErrorsHelperText).toHaveLength(2);
    });

    // Enter two characters in the `Username` field
    await user.type(usernameField, "Jo");

    await waitFor(() => {
      // UI still displays error
      expect(usernameFieldLabel).toHaveClass("Mui-error");
      expect(usernameField).toHaveFocus();
    });

    // Enter more characters in the username field
    await user.type(usernameField, "hn");

    // UI no more displays error
    expect(usernameField).toHaveValue("John");
    expect(usernameFieldLabel).not.toHaveClass("Mui-error");

    // Delete some characters from the `Username` to trigger the error again
    await user.type(usernameField, "{backspace}{backspace}");

    await waitFor(() => {
      // UI displays error again
      expect(usernameField).toHaveValue("Jo");
      expect(usernameFieldLabel).toHaveClass("Mui-error");
      expect(usernameField).toHaveFocus();
    });
  });

  test("validates password field correctly", async () => {
    const user = userEvent.setup();

    render(<MockRouter initialEntries={["/signup"]} />);

    const signupButton = screen.getByRole("button", {
      name: /create an account/i,
    });
    // Username field
    const usernameField = screen.getByRole("textbox", {
      name: /username/i,
    });
    const usernameFieldLabel = usernameField.parentElement;
    const usernameErrorHelperTextContent =
      /username must be at least 3 characters long/i;
    // Password field
    const passwordField = screen.getByLabelText(/^password/i);
    const passwordFieldLabel = passwordField.parentElement;
    const passwordErrorHelperTextContent =
      /password must be at least 6 characters long/i;
    // Confirm Password field
    const confirmPasswordField = screen.getByLabelText(/confirm password/i);
    const confirmPasswordFieldLabel = passwordField.parentElement;

    // No error displayed in the UI
    expect(usernameFieldLabel).not.toHaveClass("Mui-error");
    expect(passwordFieldLabel).not.toHaveClass("Mui-error");
    expect(confirmPasswordField).not.toHaveClass("Mui-error");
    expect(() => screen.getByText(usernameErrorHelperTextContent)).toThrow();
    expect(() => screen.getByText(passwordErrorHelperTextContent)).toThrow();

    // Enter a password that is too short
    await user.type(usernameField, "testUser");
    await user.type(passwordField, "12345");
    await user.type(confirmPasswordField, "12345");

    await user.click(signupButton);

    await waitFor(() => {
      const passwordErrorsHelperText = screen.getAllByText(
        passwordErrorHelperTextContent,
      );

      // UI displays error for password and confirm password fields
      expect(usernameFieldLabel).not.toHaveClass("Mui-error");
      expect(passwordField).toHaveValue("12345");
      expect(confirmPasswordField).toHaveValue("12345");
      expect(passwordFieldLabel).toHaveClass("Mui-error");
      expect(confirmPasswordFieldLabel).toHaveClass("Mui-error");
      expect(passwordErrorsHelperText).toHaveLength(2);
      expect(passwordField).toHaveFocus();
    });

    // Enter a password of correct length
    await user.type(passwordField, "6");
    await user.type(confirmPasswordField, "6");

    // UI displays no error
    expect(passwordField).toHaveValue("123456");
    expect(confirmPasswordField).toHaveValue("123456");
    expect(passwordFieldLabel).not.toHaveClass("Mui-error");
    expect(confirmPasswordFieldLabel).not.toHaveClass("Mui-error");

    // Enter a forbidden character in the password field
    await user.type(passwordField, "(");
    await user.type(confirmPasswordField, "(");

    const newPasswordErrorHelperTextContent =
      /only use letters, numbers, dashes and underscores/i;

    const newPasswordErrorsHelperText = screen.getAllByText(
      newPasswordErrorHelperTextContent,
    );

    // UI displays appropriate error
    expect(passwordFieldLabel).toHaveClass("Mui-error");
    expect(confirmPasswordFieldLabel).toHaveClass("Mui-error");
    expect(newPasswordErrorsHelperText).toHaveLength(2);

    // Delete forbidden characters
    await user.type(passwordField, "{backspace}");
    await user.type(confirmPasswordField, "{backspace}");

    // UI displays no error
    expect(passwordField).toHaveValue("123456");
    expect(confirmPasswordField).toHaveValue("123456");
    expect(passwordFieldLabel).not.toHaveClass("Mui-error");
    expect(confirmPasswordFieldLabel).not.toHaveClass("Mui-error");
  });

  test("validates matching passwords", async () => {
    const user = userEvent.setup();

    render(<MockRouter initialEntries={["/signup"]} />);

    const signupButton = screen.getByRole("button", {
      name: /create an account/i,
    });
    // Username field
    const usernameField = screen.getByRole("textbox", {
      name: /username/i,
    });
    const usernameFieldLabel = usernameField.parentElement;
    const usernameErrorHelperTextContent =
      /username must be at least 3 characters long/i;
    // Password field
    const passwordField = screen.getByLabelText(/^password/i);
    const passwordFieldLabel = passwordField.parentElement;
    const passwordErrorHelperTextContent =
      /password must be at least 6 characters long/i;
    // Confirm Password field
    const confirmPasswordField = screen.getByLabelText(/confirm password/i);
    const confirmPasswordFieldLabel = confirmPasswordField.parentElement;

    // No error displayed in the UI
    expect(usernameFieldLabel).not.toHaveClass("Mui-error");
    expect(passwordFieldLabel).not.toHaveClass("Mui-error");
    expect(confirmPasswordFieldLabel).not.toHaveClass("Mui-error");
    expect(() => screen.getByText(usernameErrorHelperTextContent)).toThrow();
    expect(() => screen.getByText(passwordErrorHelperTextContent)).toThrow();

    // Enter different passwords
    await user.type(usernameField, "testUser");
    await user.type(passwordField, "123456");
    await user.type(confirmPasswordField, "1234567");

    await user.click(signupButton);

    const matchingPasswordsError = screen.getByText(/passwords do not match/i);

    // UI displays appropriate error
    expect(passwordField).toHaveValue("123456");
    expect(confirmPasswordField).toHaveValue("1234567");
    expect(confirmPasswordFieldLabel).toHaveClass("Mui-error");
    expect(matchingPasswordsError).toBeInTheDocument();
  });

  test("submits form when submit button is clicked", async () => {
    const user = userEvent.setup();
    const logSpy = vi.spyOn(console, "log");

    render(<MockRouter initialEntries={["/signup"]} />);

    const usernameFieldText = "testUser";
    const passwordText = "testPassword";
    const usernameField = screen.getByRole("textbox", { name: /username/i });
    const passwordField = screen.getByLabelText(/^password/i);
    const confirmPasswordField = screen.getByLabelText(/confirm password/i);
    const signupButton = screen.getByRole("button", {
      name: /create an account/i,
    });

    // Fill the form
    await user.type(usernameField, usernameFieldText);
    await user.type(passwordField, passwordText);
    await user.type(confirmPasswordField, passwordText);

    expect(usernameField).toHaveValue(usernameFieldText);
    expect(passwordField).toHaveValue(passwordText);
    expect(confirmPasswordField).toHaveValue(passwordText);

    // Submit the form
    await user.click(signupButton);

    // Check form submitted values to match entered values
    expect(logSpy).toHaveBeenCalledOnce();
    expect(logSpy).toHaveBeenCalledWith({
      username: usernameFieldText,
      password: passwordText,
      confirmPassword: passwordText,
    });
  });

  test("redirects to home page on successful form submit", async () => {
    const user = userEvent.setup();

    render(<MockRouter initialEntries={["/signup"]} />);

    const usernameFieldText = "testUser";
    const passwordText = "testPassword";
    const usernameField = screen.getByRole("textbox", { name: /username/i });
    const passwordField = screen.getByLabelText(/^password/i);
    const confirmPasswordField = screen.getByLabelText(/confirm password/i);
    const signupButton = screen.getByRole("button", {
      name: /create an account/i,
    });

    // Fill the form
    await user.type(usernameField, usernameFieldText);
    await user.type(passwordField, passwordText);
    await user.type(confirmPasswordField, passwordText);

    expect(usernameField).toHaveValue(usernameFieldText);
    expect(passwordField).toHaveValue(passwordText);
    expect(confirmPasswordField).toHaveValue(passwordText);

    // Submit the form
    await user.click(signupButton);

    const headingText = /home/i;
    const heading = screen.getByRole("heading");

    // Redirect to Home page on successful submit
    await waitFor(() => {
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent(headingText);
    });
  });

  test("redirects to signup page on button click", async () => {
    const user = userEvent.setup();

    render(<MockRouter initialEntries={["/signup"]} />);

    const loginButton = screen.getByRole("button", {
      name: /log in/i,
    });

    // Press "Log in" button
    await user.click(loginButton);

    // Redirect to login page
    await waitFor(() => {
      const headingText = /log in/i;
      const heading = screen.getByRole("heading");

      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent(headingText);
    });
  });
});
