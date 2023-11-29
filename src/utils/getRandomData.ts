type ProductType = {
  title?: string;
};

const getRandomInt = (max = 10, min = 1) =>
  Math.floor(Math.random() * (max - min) + min);

const getRandomData = async <T>(url: string, id?: number) => {
  const randomId = id ?? getRandomInt(30);
  const data = await fetch(`${url}/${randomId}`);
  const json = (await data.json()) as T;
  return json;
};

const getProductsArray = async () => {
  const randomProductsCount = getRandomInt(3);

  // Randomly set between 1and 3 unique product IDs
  const products = new Map<string, number>();
  let i = 0;
  while (i < randomProductsCount) {
    const randomId = getRandomInt();
    const { title } = await getRandomData<ProductType>(
      "https://dummyjson.com/products/",
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

export { getRandomData, getRandomInt, getProductsArray };
