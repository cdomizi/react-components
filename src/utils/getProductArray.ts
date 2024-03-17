import { getRandomData } from "./getRandomData";
import { getRandomInt } from "./getRandomInt";

export type ProductType = {
  title?: string;
};

export const getProductArray = async () => {
  const maxProductCount = 3;
  const randomProductCount = getRandomInt(maxProductCount);
  const maxQuantity = 3;

  // Randomly set between 1 and 3 unique product IDs
  const products = new Map<string, number>();
  let i = 0;
  while (i < randomProductCount) {
    const randomId = getRandomInt();
    const { title } = await getRandomData<ProductType>(
      "https://dummyjson.com/product",
      randomId,
    );
    const randomQuantity = getRandomInt(maxQuantity);
    title?.length && products.set(title, randomQuantity);
    i++;
  }

  // Format output as an array
  const productArray: { product: string; quantity: number }[] = [];
  products.forEach((items, title) =>
    productArray.push({
      product: title,
      quantity: items,
    }),
  );

  return productArray;
};
