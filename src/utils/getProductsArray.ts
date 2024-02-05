import { getRandomData } from "./getRandomData";
import { getRandomInt } from "./getRandomInt";

export type ProductType = {
  title?: string;
};

export const getProductsArray = async () => {
  const randomProductsCount = getRandomInt(3);

  // Randomly set between 1 and 3 unique product IDs
  const products = new Map<string, number>();
  let i = 0;
  while (i < randomProductsCount) {
    const randomId = getRandomInt();
    const { title } = await getRandomData<ProductType>(
      "https://dummyjson.com/product",
      randomId,
    );
    title?.length && products.set(title, randomProductsCount);
    i++;
  }

  // Format output as an array
  const productsArray: { product: string; quantity: number }[] = [];
  products.forEach((items, title) =>
    productsArray.push({
      product: title,
      quantity: items,
    }),
  );

  return productsArray;
};
