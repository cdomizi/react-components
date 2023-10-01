type User = {
  id?: number;
  username?: string;
  email?: string;
};

type Product = {
  title?: string;
};

const getRandomInt = (max = 10, min = 1) =>
  Math.floor(Math.random() * max + min);

const getRandomUser = async () => {
  const id = getRandomInt(30);
  const data = await fetch(`https://dummyjson.com/users/${id}`);
  const json = (await data.json()) as User;
  return json;
};

const getRandomProduct = async (id: number) => {
  const data = await fetch(`https://dummyjson.com/products/${id}`);
  const json = (await data.json()) as Product;
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
    const { title } = await getRandomProduct(randomId);
    products.push({ product: title, quantity: randomProductsCount });
    i++;
  }

  return products;
};

export { getRandomInt, getRandomUser, getRandomProduct, getProductsArray };
