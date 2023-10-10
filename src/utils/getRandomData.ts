type ProductType = {
  title?: string;
};

const getRandomInt = (max = 10, min = 1) =>
  Math.floor(Math.random() * max + min);

const getRandomData = async <T>(url: string, id?: number) => {
  const randomId = id ?? getRandomInt(30);
  const data = await fetch(`${url}/${randomId}`);
  const json = (await data.json()) as T;
  return json;
};

const getProductsArray = async () => {
  // Prevent getting duplicate product Ids
  const productIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const getUniqueId = (arr: number[]) => {
    const removedId = arr.splice(getRandomInt(arr.length - 1, 0), 1)[0];
    return removedId;
  };
  const randomProductsCount = getRandomInt(3);

  // Set a random number of random product IDs.
  const products = [];
  let i = 0;
  while (i < randomProductsCount) {
    const randomId = getUniqueId(productIds);
    const { title } = await getRandomData<ProductType>(
      "https://dummyjson.com/products/",
      randomId,
    );
    products.push({ product: title, quantity: randomProductsCount });
    i++;
  }

  return products;
};

export default getRandomData;

export { getRandomInt, getProductsArray };
