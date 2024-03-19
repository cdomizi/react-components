import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axios, { AxiosError, AxiosResponse } from "axios";
import { allProducts, newProduct } from "mocks/data";
import { Product } from "types";
import { Axios } from "../Axios";

describe("Axios", () => {
  test("component renders correctly", () => {
    render(<Axios />);

    const heading = screen.getByText(/axios/i);
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

  test("fetches product data successfully", async () => {
    const productId = 1;
    const expectedProduct = allProducts.find(
      (product) => product.id === productId,
    );

    const user = userEvent.setup();

    const axiosGetSpy = vi.spyOn(axios, "get");

    render(<Axios />);

    const getProductButton = screen.getByRole("button", {
      name: /^get product$/i,
    });

    // Get product data
    await user.click(getProductButton);

    const loadingText = screen.getByText(/loading/i);

    // Loading text being displayed
    expect(loadingText).toBeInTheDocument();

    const responseData = (await axiosGetSpy.mock.results[0]
      .value) as AxiosResponse;

    // Response data fetched correctly
    expect(axiosGetSpy).toHaveBeenCalledOnce();
    expect(axiosGetSpy).toHaveBeenCalledWith(
      `https://dummyjson.com/product/${productId}`,
    );
    expect(await responseData.data).toStrictEqual(expectedProduct);
  });

  test("adds new product successfully", async () => {
    const user = userEvent.setup();

    const axiosPostSpy = vi.spyOn(axios, "post");

    render(<Axios />);

    const addProductButton = screen.getByRole("button", {
      name: /^add product$/i,
    });

    // Create new product
    await user.click(addProductButton);

    const loadingText = screen.getByText(/loading/i);

    // Loading text being displayed
    expect(loadingText).toBeInTheDocument();

    const responseData = (await axiosPostSpy.mock.results[0]
      .value) as AxiosResponse;

    // New product created correctly
    expect(axiosPostSpy).toHaveBeenCalledOnce();
    expect(await responseData.data).toStrictEqual(newProduct);
  });

  test("displays error message for failed product fetch", async () => {
    const user = userEvent.setup();

    const axiosGetSpy = vi.spyOn(axios, "get");

    render(<Axios />);

    const getErrorButton = screen.getByRole("button", {
      name: /^get product error$/i,
    });

    // Trigger error while getting product data
    await user.click(getErrorButton);

    const responseData = (await axiosGetSpy.mock.results[0]
      .value) as AxiosError<Product, Product>;

    // Get 404 response
    expect(axiosGetSpy).toHaveBeenCalledOnce();
    expect(responseData.response?.status).toBe(404);
    expect(responseData.response?.statusText).toMatch(/Not Found/i);
  });

  test("displays error message for failed product addition", async () => {
    const user = userEvent.setup();

    const axiosPostSpy = vi.spyOn(axios, "post");

    render(<Axios />);

    const addErrorButton = screen.getByRole("button", {
      name: /^add product error$/i,
    });

    // Trigger error while getting product data
    await user.click(addErrorButton);

    const responseData = (await axiosPostSpy.mock.results[0]
      .value) as AxiosError;

    // Get 404 response
    expect(axiosPostSpy).toHaveBeenCalledOnce();
    expect(responseData.response?.status).toBe(404);
    expect(responseData.response?.statusText).toMatch(/Not Found/i);
  });
});
