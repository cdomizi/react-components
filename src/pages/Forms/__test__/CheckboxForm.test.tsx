import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CheckboxForm } from "../CheckboxForm";

describe("Checkbox form", () => {
  test("component renders correctly", () => {
    render(<CheckboxForm />);

    const title = screen.getByRole("heading");
    const checkbox = screen.getByRole("checkbox", {
      name: /accept terms & conditions/i,
    });
    const submitButton = screen.getByRole("button", { name: /submit/i });

    expect(title).toMatch(/checkbox form/i);
    expect(checkbox).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();
  });

  test("checkbox default status", () => {
    render(<CheckboxForm />);

    const checkbox = screen.getByRole("checkbox", {
      name: /accept terms & conditions/i,
    });

    expect(checkbox).not.toBeChecked();
  });

  test("checkbox toggling", async () => {
    const user = userEvent.setup();

    render(<CheckboxForm />);

    const checkbox = screen.getByRole("checkbox", {
      name: /accept terms & conditions/i,
    });

    // Checkbox is unchecked by default
    expect(checkbox).not.toBeChecked();

    // Check the checkbox
    await user.click(checkbox);

    // Checkbox is now checked
    expect(checkbox).toBeChecked();

    // Uncheck the checkbox
    await user.click(checkbox);

    // Checkbox is unchecked again
    expect(checkbox).not.toBeChecked();
  });

  test("form submission", async () => {
    const user = userEvent.setup();
    const logSpy = vi.spyOn(console, "log");

    render(<CheckboxForm />);

    const submitButton = screen.getByRole("button", { name: /submit/i });
    const expectedOutput = { status: false };

    // Submit the form
    await user.click(submitButton);

    // Form submitted value match expected value
    expect(logSpy).toHaveBeenCalledOnce();
    expect(logSpy).toHaveBeenCalledWith(expectedOutput);
  });

  test("reset on submit", async () => {
    const user = userEvent.setup();

    render(<CheckboxForm />);

    const checkbox = screen.getByRole("checkbox", {
      name: /accept terms & conditions/i,
    });
    const submitButton = screen.getByRole("button", { name: /submit/i });

    // Checkbox is unchecked by default
    expect(checkbox).not.toBeChecked();

    // Check the checkbox
    await user.click(checkbox);

    // Checkbox is now checked
    expect(checkbox).toBeChecked();

    // Submit the form
    await user.click(submitButton);

    // Checkbox status reset to default after submit
    await waitFor(() => expect(checkbox).not.toBeChecked());
  });
});
