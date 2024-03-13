import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { allUsers } from "mocks/data";
import * as getProductsArray from "utils/getProductsArray";
import * as getRandomData from "utils/getRandomData";
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
    const productsList = screen.getByRole("list");
    const submitButton = screen.getByRole("button", { name: /submit/i });

    expect(title).toMatch(/array form/i);
    expect(customerField).toBeInTheDocument();
    expect(fillWithRandomDataButton).toBeInTheDocument();
    expect(productsList).toBeInTheDocument();
    // Products list is empty by default
    expect(() => screen.getByRole("listitem")).toThrow();
    expect(addProductButton).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();
  });

  test("required field validation", async () => {
    const user = userEvent.setup();

    render(<ArrayForm />);

    const customerField: HTMLInputElement = screen.getByRole("combobox");
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

    await waitFor(() => {
      // Error displayed in the UI
      expect(customerFieldLabel).toHaveClass("Mui-error");
      expect(customerField).toHaveFocus();

      const productErrorHelperText = screen.getByText(
        /please add at least one product/i,
      );

      // Product error helper text displayed
      expect(productErrorHelperText).toBeInTheDocument();
    });

    // Select a customer
    await user.click(customerField);
    const customerList = await waitFor(() => screen.getAllByRole("option"), {});
    await user.click(customerList[0]);

    // Customer field error disappeared
    await waitFor(() => expect(customerField).not.toHaveValue(""));
    expect(customerFieldLabel).not.toHaveClass("Mui-error");

    // Add a product
    await user.click(addProductButton);

    await waitFor(() => {
      // Product error helper text disappeared
      expect(() =>
        screen.getByText(/please add at least one product/i),
      ).toThrow();
    });

    // Product field renders correctly
    const productField = screen.getByRole("listitem");
    const productTitleField = screen.getByRole("textbox", {
      name: /product/i,
    });
    const productTitleFieldLabel = productTitleField.parentElement;

    expect(productField).toBeInTheDocument();
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

    const customerField: HTMLInputElement = screen.getByRole("combobox");

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
    expect(() => screen.getByRole("listitem")).toThrow();
    expect(() => screen.getByRole("textbox", { name: /product/i })).toThrow();
    expect(() =>
      screen.getByRole("spinbutton", { name: /quantity/i }),
    ).toThrow();
    expect(() => screen.getByRole("button", { name: /delete/i })).toThrow();

    // Add product
    await user.click(addProductButton);

    const productField = screen.getByRole("listitem");
    const productTitleField = screen.getByRole("textbox", { name: /product/i });
    const productQuantityField = screen.getByRole("spinbutton", {
      name: /quantity/i,
    });
    const deleteButton = screen.getByRole("button", { name: /delete/i });

    // Product fields displayed correctly with default values
    expect(productField).toBeInTheDocument();
    expect(productTitleField).toBeInTheDocument();
    expect(productTitleField).toHaveValue("");
    expect(productQuantityField).toBeInTheDocument();
    expect(productQuantityField).toHaveValue(1);
    expect(deleteButton).toBeInTheDocument();

    // Cannot set product quantity below 1
    await user.click(productQuantityField);

    // Remove product
    await user.click(deleteButton);

    // No products being shown
    expect(() => screen.getByRole("listitem")).toThrow();
    expect(() => screen.getByRole("textbox", { name: /product/i })).toThrow();
    expect(() =>
      screen.getByRole("spinbutton", { name: /quantity/i }),
    ).toThrow();
    expect(() => screen.getByRole("button", { name: /delete/i })).toThrow();

    // Add two products
    await user.click(addProductButton);
    await user.click(addProductButton);

    const productFields = screen.getAllByRole("listitem");
    const productTitleFields = screen.getAllByRole("textbox", {
      name: /product/i,
    });
    const productQuantityFields = screen.getAllByRole("spinbutton", {
      name: /quantity/i,
    });
    const deleteButtons = screen.getAllByRole("button", { name: /delete/i });

    // Each product is displayed correctly
    expect(productFields).toHaveLength(2);
    productTitleFields.forEach((productField) => {
      expect(productField).toBeInTheDocument();
    });
    productQuantityFields.forEach((quantityField) => {
      expect(quantityField).toBeInTheDocument();
    });
    deleteButtons.forEach((deleteButton) => {
      expect(deleteButton).toBeInTheDocument();
    });
  });

  test("fill with random data", async () => {
    // Mock random data
    const randomCustomer = allUsers[0];
    const productsArray = [
      { product: "screwdriver", quantity: 2 },
      { product: "hammer", quantity: 1 },
      { product: "helmet", quantity: 1 },
    ];

    vi.spyOn(getRandomData, "getRandomData").mockImplementation(
      () =>
        new Promise((resolve) => {
          setTimeout(() => {
            resolve(randomCustomer);
          }, 50);
        }),
    );
    vi.spyOn(getProductsArray, "getProductsArray").mockImplementation(
      () =>
        new Promise((resolve) => {
          setTimeout(() => {
            resolve(productsArray);
          }, 50);
        }),
    );

    const user = userEvent.setup();

    render(<ArrayForm />);

    const customerField: HTMLInputElement = screen.getByRole("combobox");
    const fillWithRandomDataButton = screen.getByRole("button", {
      name: /fill with random data/i,
    });
    const addProductButton = screen.getByRole("button", {
      name: /add product/i,
    });
    const submitButton = screen.getByRole("button", { name: /submit/i });

    expect(customerField).toHaveValue("");
    expect(() => screen.getByRole("listitem")).toThrow();

    // Fill the form with random data
    await user.click(fillWithRandomDataButton);

    // All fields & buttons disabled while filling the form
    expect(fillWithRandomDataButton).toHaveClass("Mui-disabled");
    expect(customerField).toHaveClass("Mui-disabled");
    expect(addProductButton).toHaveClass("Mui-disabled");
    expect(submitButton).toHaveClass("Mui-disabled");

    await waitFor(() => {
      // All fields and buttons no more disabled
      expect(fillWithRandomDataButton).not.toHaveClass("Mui-disabled");
      expect(customerField).not.toHaveClass("Mui-disabled");
      expect(addProductButton).not.toHaveClass("Mui-disabled");
      expect(submitButton).not.toHaveClass("Mui-disabled");

      // Random customer selected
      expect(customerField).toHaveValue(
        `#${randomCustomer.id} ${randomCustomer.firstName} ${randomCustomer.lastName}`,
      );

      const productFields = screen.getAllByRole("listitem");
      const productTitles = screen.getAllByRole("textbox", {
        name: /product/i,
      });
      const productQuantities = screen.getAllByRole("spinbutton", {
        name: /quantity/i,
      });

      // Random products added
      expect(productFields).toHaveLength(productsArray.length);

      productTitles.forEach((product, index) => {
        expect(product).toHaveValue(productsArray[index].product);
      });
      productQuantities.forEach((quantity, index) => {
        expect(quantity).toHaveValue(productsArray[index].quantity);
      });
    });
  });

  test("form submission", async () => {
    const user = userEvent.setup();
    const logSpy = vi.spyOn(console, "log");

    render(<ArrayForm />);

    const customerField: HTMLInputElement = screen.getByRole("combobox");
    const addProductButton = screen.getByRole("button", {
      name: /add product/i,
    });
    const submitButton = screen.getByRole("button", { name: /submit/i });

    const ENTERED_VALUES = {
      customer: { id: 1, firstName: "Terry", lastName: "Medhurst" },
      products: [
        {
          product: "screwdriver",
          quantity: 1,
        },
      ],
    };

    // Select a customer
    await user.click(customerField);
    const customerOption = await waitFor(() =>
      screen.getByRole("option", {
        name: `#${ENTERED_VALUES.customer.id} ${ENTERED_VALUES.customer.firstName} ${ENTERED_VALUES.customer.lastName}`,
      }),
    );
    await user.click(customerOption);

    // Add a product
    await user.click(addProductButton);
    const productTitleField = screen.getByRole("textbox", { name: /product/i });
    await user.type(productTitleField, `${ENTERED_VALUES.products[0].product}`);

    expect(logSpy).not.toHaveBeenCalled();

    // Submit the form
    await user.click(submitButton);

    // Check form submitted values to match entered values
    expect(logSpy).toHaveBeenCalledOnce();
    expect(logSpy).toHaveBeenCalledWith(ENTERED_VALUES);
  });

  test("reset on submit", async () => {
    const user = userEvent.setup();

    render(<ArrayForm />);

    const customerField = screen.getByRole("combobox");
    const addProductButton = screen.getByRole("button", {
      name: /add product/i,
    });
    const submitButton = screen.getByRole("button", { name: /submit/i });

    // Select a customer
    await user.click(customerField);
    const customerOption = await waitFor(() =>
      screen.getByRole("option", {
        name: /medhurst/i,
      }),
    );
    await user.click(customerOption);

    // Add a product
    await user.click(addProductButton);
    const productTitleField = screen.getByRole("textbox", { name: /product/i });
    await user.type(productTitleField, "screwdriver");

    const productsList = screen.getAllByRole("textbox", { name: /product/i });

    // Form fields are not empty
    expect(customerField).not.toHaveValue("");
    expect(productsList.length).toBeGreaterThan(0);

    // Submit the form
    await user.click(submitButton);

    // Form reset to default after submit
    await waitFor(() => {
      expect(customerField).toHaveValue("");
      expect(() => screen.getAllByRole("textbox")).toThrow();
    });
  });
});
