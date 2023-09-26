import { useEffect } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useForm,
  Controller,
  SubmitHandler,
  useFieldArray,
} from "react-hook-form";
import Logger from "../../components/Logger";

import {
  Button,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Delete as DeleteIcon } from "@mui/icons-material";

const CartForm = () => {
  const productsSchema = z.object({
    products: z
      .array(
        z.object({
          product: z
            .string({ required_error: "Product name is required" })
            .min(1, { message: "Product name is required" })
            .trim(),
          quantity: z
            .number({
              required_error: "Quantity is required",
              invalid_type_error: "Please enter a positive number",
            })
            .positive({ message: "Add at least one product" })
            .or(
              // Allow strings if they are integers
              z.custom<string>(
                (data) => typeof data === "string" && parseInt(data) > 0,
                "Please enter a positive number",
              ),
            ),
        }),
      )
      .nonempty({ message: "Please add at least one product" }),
  });

  type ProductType = z.infer<typeof productsSchema>["products"][number];

  type FormType = z.infer<typeof productsSchema>;

  const {
    control,
    handleSubmit,
    watch,
    formState: { isSubmitSuccessful, errors },
    reset,
  } = useForm<FormType>({
    defaultValues: { products: [] },
    resolver: zodResolver(productsSchema),
  });

  const { fields, append, remove } = useFieldArray<FormType, "products">({
    control,
    name: "products",
    rules: {
      required: "Please, add at least one product",
    },
  });

  const onSubmit: SubmitHandler<FormType> = (formData) => {
    // Process form data for submit
    const submitData = {
      products: formData.products?.map((product: ProductType) => ({
        product,
        quantity:
          typeof product.quantity === "string"
            ? parseInt(product.quantity, 10)
            : product.quantity,
      })),
    };

    console.log(submitData);
  };

  // Reset the form on submit
  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
      remove();
    }
  }, [isSubmitSuccessful, fields, remove, reset]);

  return (
    <Stack
      id="array-form"
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      autoComplete="off"
      spacing={2}
    >
      <Typography variant="h4">Array Form</Typography>
      {fields.map((item, index) => (
        <Stack key={item.id} direction="row" spacing={1}>
          <Controller
            control={control}
            name={`products.${index}.product`}
            render={({ field }) => (
              <TextField
                {...field}
                id="product"
                label="Product"
                InputLabelProps={{ shrink: true }}
                autoFocus={!!errors.products?.[index]?.product}
                error={!!errors.products?.[index]?.product}
                helperText={errors.products?.[index]?.product?.message}
              />
            )}
          />
          <Controller
            control={control}
            name={`products.${index}.quantity`}
            render={({ field }) => (
              <TextField
                {...field}
                id="quantity"
                label="Quantity"
                InputLabelProps={{ shrink: true }}
                type="number"
                autoFocus={!!errors.products?.[index]?.quantity}
                error={!!errors.products?.[index]?.quantity}
                helperText={errors.products?.[index]?.quantity?.message}
                // InputProps={{ inputProps: { min: 1 } }}
                sx={{ maxWidth: "5rem" }}
              />
            )}
          />
          <IconButton onClick={() => remove(index)}>
            <DeleteIcon />
          </IconButton>
        </Stack>
      ))}
      <Typography color="error.main">{errors?.products?.message}</Typography>
      <Button
        type="button"
        variant="outlined"
        size="small"
        onClick={() => append({ product: "", quantity: 1 })}
      >
        Add Product
      </Button>
      <Button type="submit" variant="contained">
        Submit
      </Button>
      <Logger value={watch()} />
    </Stack>
  );
};

export default CartForm;
