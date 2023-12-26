import { render, screen, waitFor } from "@testing-library/react";
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
    const addProductButton = screen.getByRole("button", {
      name: /add product/i,
    });
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
    expect(customerField).toHaveFocus();

    const productErrorHelperText = screen.getByText(
      /please add at least one product/i,
    );

    // Product error helper text displayed
    expect(productErrorHelperText).toBeInTheDocument();

    // Select a customer
    await user.click(customerField);
    const customerList = await waitFor(() => screen.getAllByRole("option"));
    await user.click(customerList[0]);

    // Customer field error disappeared
    await waitFor(() => expect(customerField).not.toHaveValue(""));
    expect(customerFieldLabel).not.toHaveClass("Mui-error");

    // Add a product
    await user.click(addProductButton);

    // Product error helper text disappeared
    expect(() =>
      screen.getByText(/please add at least one product/i),
    ).toThrow();

    // Product field renders correctly
    const productTitleField = screen.getByRole("textbox", { name: /product/i });
    const productTitleFieldLabel = productTitleField.parentElement;

    // Error displayed in the product title field
    expect(productTitleFieldLabel).toHaveClass("Mui-error");

    // Enter a product title
    await user.type(productTitleField, "screwdriver");

    // Product title field error disappeared
    expect(productTitleFieldLabel).not.toHaveClass("Mui-error");
  });

  test("select and deselect customer", async () => {
    const user = userEvent.setup();

    render(<ArrayForm />);

    const customerField = screen.getByRole("combobox");

    // Field is empty by default
    expect(customerField).toHaveValue("");

    // Open the dropdown
    await user.click(customerField);

    const customersList = await waitFor(() => screen.getAllByRole("option"));
    const firstCustomer = customersList[0];

    // Customers' list is not empty
    expect(customersList.length).toBeGreaterThan(0);

    // Select the first customer
    await user.click(firstCustomer);

    expect(customerField).toHaveValue(firstCustomer.textContent);

    const clearButton = screen.getByRole("button", { name: /clear/i });

    // Clear the selection
    await user.click(clearButton);

    // The field is now empty again
    expect(customerField).toHaveValue("");

    // Enter a customer name
    await user.type(customerField, "terry");

    // Get displayed options
    const matchingCustomers = screen.getAllByRole("option");

    // All displayed options match the entered text
    matchingCustomers.forEach((customer) => expect(customer).toMatch(/terry/i));

    // Enter an unexisting customer name
    await user.type(customerField, "###");

    // No options are displayed
    expect(() => screen.getAllByRole("option")).toThrow();
    expect(screen.getAllByRole("presentation")[0]).toHaveTextContent(
      /no customers/i,
    );
  });

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

    // Product fields displayed correctly with default values
    expect(productField).toBeInTheDocument();
    expect(productField).toHaveValue("");
    expect(quantityField).toBeInTheDocument();
    expect(quantityField).toHaveValue(1);
    expect(deleteButton).toBeInTheDocument();

    // Cannot set product quantity below 1
    await user.click(quantityField);

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
