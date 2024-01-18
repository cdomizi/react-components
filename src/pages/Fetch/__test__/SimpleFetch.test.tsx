import { SimpleFetch } from "@Fetch/SimpleFetch";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { allProducts, createProduct } from "mocks/data";

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

    expect(heading).toBeInTheDocument();
    expect(getProductButton).toBeInTheDocument();
    expect(getProductErrorButton).toBeInTheDocument();
    expect(addProductButton).toBeInTheDocument();
    expect(addProductErrorButton).toBeInTheDocument();
  });

  test.only("get product", async () => {
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

  test("add product", async () => {
    const user = userEvent.setup();

    const fetchSpy = vi.spyOn(globalThis, "fetch");

    render(<SimpleFetch />);

    const addProductButton = screen.getByRole("button", {
      name: /^add product$/i,
    });

    // Get product data
    await user.click(addProductButton);

    const loadingText = screen.getByText(/loading/i);

    // Loading text being displayed
    expect(loadingText).toBeInTheDocument();

    const responseData = (await fetchSpy.mock.results[0].value) as Response;

    // Response data fetched correctly
    expect(fetchSpy).toHaveBeenCalledOnce();
    expect(await responseData.json()).toStrictEqual(createProduct);
  });

  test.todo("get product error");

  test.todo("add product error");
});
