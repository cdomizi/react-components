import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axios, { AxiosResponse } from "axios";
import { allProducts, newProduct } from "mocks/data";
import { notFoundError } from "utils/__test__/axiosErrorHandler.test";
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

  test("get product", async () => {
    const productId = 1;
    const expectedProduct = allProducts.find(
      (product) => product.id === productId,
    );

    const user = userEvent.setup();

    const axiosGetSpy = vi
      .spyOn(axios, "get")
      .mockResolvedValueOnce({ data: expectedProduct });

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

  test("add product", async () => {
    const user = userEvent.setup();

    const axiosPostSpy = vi
      .spyOn(axios, "post")
      .mockResolvedValueOnce({ data: newProduct });

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

  test("get product error", async () => {
    const user = userEvent.setup();

    const axiosGetSpy = vi
      .spyOn(axios, "get")
      .mockResolvedValueOnce(notFoundError);

    render(<Axios />);

    const getErrorButton = screen.getByRole("button", {
      name: /^get product error$/i,
    });

    // Trigger error while getting product data
    await user.click(getErrorButton);

    const loadingText = screen.getByText(/loading/i);

    // Loading text being displayed
    expect(loadingText).toBeInTheDocument();

    const responseData = (await axiosGetSpy.mock.results[0]
      .value) as AxiosResponse;

    // Get 404 response
    expect(axiosGetSpy).toHaveBeenCalledOnce();
    expect(responseData).toStrictEqual(notFoundError);
  });

  test("add product error", async () => {
    const user = userEvent.setup();

    const axiosPostSpy = vi
      .spyOn(axios, "post")
      .mockResolvedValueOnce(notFoundError);

    render(<Axios />);

    const addErrorButton = screen.getByRole("button", {
      name: /^add product error$/i,
    });

    // Trigger error while getting product data
    await user.click(addErrorButton);

    const loadingText = screen.getByText(/loading/i);

    // Loading text being displayed
    expect(loadingText).toBeInTheDocument();

    const responseData = (await axiosPostSpy.mock.results[0]
      .value) as AxiosResponse;

    // Get 404 response
    expect(axiosPostSpy).toHaveBeenCalledOnce();
    expect(responseData).toStrictEqual(notFoundError);
  });
});
