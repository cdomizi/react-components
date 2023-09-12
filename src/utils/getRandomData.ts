const getRandomData = async () => {
  const id = Math.ceil(Math.random() * 100);
  const data = await fetch(`https://dummyjson.com/users/${id}`);
  const json = await data.json();
  return json;
};

export default getRandomData;
