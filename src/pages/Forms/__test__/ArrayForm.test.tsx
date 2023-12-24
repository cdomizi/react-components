import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CartForm as ArrayForm } from "../ArrayForm";

describe("Array form", () => {
  test("component renders correctly", () => {
    render(<ArrayForm />);

    const title = screen.getByRole("heading");
    const customerField = screen.getByRole("combobox");
    const fillWithRandomDataButton = screen.getByRole("button", {
      name: /fill with random data/i,
    });
    const addProductButton = screen.getByRole("button", {
      name: /add product/i,
    });
    const submitButton = screen.getByRole("button", { name: /submit/i });

    expect(title).toMatch(/array form/i);
    expect(customerField).toBeInTheDocument();
    expect(fillWithRandomDataButton).toBeInTheDocument();
    expect(addProductButton).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();
  });

  test("required field validation", async () => {
    const user = userEvent.setup();

    render(<ArrayForm />);

    const customerField = screen.getByRole("combobox");
    const customerFieldLabel = customerField.parentElement;
    const submitButton = screen.getByRole("button", { name: /submit/i });

    // No error displayed in the UI
    expect(customerFieldLabel).not.toHaveClass("Mui-error");
    expect(() =>
      screen.getByText(/please add at least one product/i),
    ).toThrow();

    // Submit the form with empty required field
    await user.click(submitButton);

    // Error displayed in the UI
    expect(customerFieldLabel).toHaveClass("Mui-error");

    const errorHelperText = screen.getByText(
      /please add at least one product/i,
    );

    // Error helper text displayed
    expect(errorHelperText).toBeInTheDocument();
  });

  test.todo("select customer");

  test("add and remove product", async () => {
    const user = userEvent.setup();

    render(<ArrayForm />);

    const addProductButton = screen.getByRole("button", {
      name: /add product/i,
    });

    // No products being shown
    expect(() => screen.getByRole("textbox", { name: /product/i })).toThrow();
    expect(() =>
      screen.getByRole("spinbutton", { name: /quantity/i }),
    ).toThrow();
    expect(() => screen.getByRole("button", { name: /delete/i })).toThrow();

    // Add product
    await user.click(addProductButton);

    const productField = screen.getByRole("textbox", { name: /product/i });
    const quantityField = screen.getByRole("spinbutton", { name: /quantity/i });
    const deleteButton = screen.getByRole("button", { name: /delete/i });

    // Product fields displayed correctly
    expect(productField).toBeInTheDocument();
    expect(quantityField).toBeInTheDocument();
    expect(deleteButton).toBeInTheDocument();

    // Remove product
    await user.click(deleteButton);

    // No products being shown
    expect(() => screen.getByRole("textbox", { name: /product/i })).toThrow();
    expect(() =>
      screen.getByRole("spinbutton", { name: /quantity/i }),
    ).toThrow();
    expect(() => screen.getByRole("button", { name: /delete/i })).toThrow();

    // Add multiple products
    await user.click(addProductButton);
    await user.click(addProductButton);

    const productFields = screen.getAllByRole("textbox", { name: /product/i });
    const quantityFields = screen.getAllByRole("spinbutton", {
      name: /quantity/i,
    });
    const deleteButtons = screen.getAllByRole("button", { name: /delete/i });

    // Each product is displayed correctly
    productFields.forEach((productField) => {
      expect(productField).toBeInTheDocument();
    });
    quantityFields.forEach((quantityField) => {
      expect(quantityField).toBeInTheDocument();
    });
    deleteButtons.forEach((deleteButton) => {
      expect(deleteButton).toBeInTheDocument();
    });
  });

  test.todo("fill with random data");

  test.todo("form submission");

  test.todo("reset on submit");
});
