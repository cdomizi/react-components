import { SimpleFetch } from "@Fetch/SimpleFetch";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { allProducts, newProduct } from "mocks/data";

describe("SimpleFetch", () => {
  test("component renders correctly", () => {
    render(<SimpleFetch />);

    const heading = screen.getByText(/simple fetch/i);
    const getProductButton = screen.getByRole("button", {
      name: /^get product$/i,
    });
    const getProductErrorButton = screen.getByRole("button", {
      name: /^get product error$/i,
    });
    const addProductButton = screen.getByRole("button", {
      name: /^add product$/i,
    });
    const addProductErrorButton = screen.getByRole("button", {
      name: /^add product error$/i,
    });
    const defaultLogValue = screen.getByText(/null/i);

    expect(heading).toBeInTheDocument();
    expect(getProductButton).toBeInTheDocument();
    expect(getProductErrorButton).toBeInTheDocument();
    expect(addProductButton).toBeInTheDocument();
    expect(addProductErrorButton).toBeInTheDocument();
    expect(defaultLogValue).toBeInTheDocument();
  });

  test("fetches product data successfully", async () => {
    const productId = 1;
    const expectedProduct = allProducts.find(
      (product) => product.id === productId,
    );

    const user = userEvent.setup();

    const fetchSpy = vi.spyOn(globalThis, "fetch");

    render(<SimpleFetch />);

    const getProductButton = screen.getByRole("button", {
      name: /^get product$/i,
    });

    // Get product data
    await user.click(getProductButton);

    const loadingText = screen.getByText(/loading/i);

    // Loading text being displayed
    expect(loadingText).toBeInTheDocument();

    const responseData = (await fetchSpy.mock.results[0].value) as Response;

    // Response data fetched correctly
    expect(fetchSpy).toHaveBeenCalledOnce();
    expect(fetchSpy).toHaveBeenCalledWith(
      `https://dummyjson.com/product/${productId}`,
    );
    expect(await responseData.json()).toStrictEqual(expectedProduct);
  });

  test("adds new product successfully", async () => {
    const user = userEvent.setup();

    const fetchSpy = vi.spyOn(globalThis, "fetch");

    render(<SimpleFetch />);

    const addProductButton = screen.getByRole("button", {
      name: /^add product$/i,
    });

    // Create new product
    await user.click(addProductButton);

    const loadingText = screen.getByText(/loading/i);

    // Loading text being displayed
    expect(loadingText).toBeInTheDocument();

    const responseData = (await fetchSpy.mock.results[0].value) as Response;

    // New product created correctly
    expect(fetchSpy).toHaveBeenCalledOnce();
    expect(await responseData.json()).toStrictEqual(newProduct);
  });

  test("displays error message for failed product fetch", async () => {
    const user = userEvent.setup();

    const fetchSpy = vi.spyOn(globalThis, "fetch");

    render(<SimpleFetch />);

    const getErrorButton = screen.getByRole("button", {
      name: /^get product error$/i,
    });

    // Trigger error while getting product data
    await user.click(getErrorButton);

    const loadingText = screen.getByText(/loading/i);

    // Loading text being displayed
    expect(loadingText).toBeInTheDocument();

    const responseData = (await fetchSpy.mock.results[0].value) as Response;

    // Get 404 response
    expect(fetchSpy).toHaveBeenCalledOnce();
    expect(responseData.ok).toBe(false);
    expect(responseData.status).toBe(404);
    expect(responseData.statusText).toMatch(/not found/i);
  });

  test("displays error message for failed product addition", async () => {
    const user = userEvent.setup();

    const fetchSpy = vi.spyOn(globalThis, "fetch");

    render(<SimpleFetch />);

    const addErrorButton = screen.getByRole("button", {
      name: /^add product error$/i,
    });

    // Trigger error while getting product data
    await user.click(addErrorButton);

    const loadingText = screen.getByText(/loading/i);

    // Loading text being displayed
    expect(loadingText).toBeInTheDocument();

    const responseData = (await fetchSpy.mock.results[0].value) as Response;

    // Get 404 response
    expect(fetchSpy).toHaveBeenCalledOnce();
    expect(responseData.ok).toBe(false);
    expect(responseData.status).toBe(404);
    expect(responseData.statusText).toMatch(/not found/i);
  });
});
