export type Product = {
  id?: number;
  title: string;
  price: number;
  brand: string;
};

export type ProductQuery = {
  method?: string;
  data: Product;
};
