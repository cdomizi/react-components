import { useCallback, useEffect, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useForm,
  Controller,
  SubmitHandler,
  useFieldArray,
} from "react-hook-form";

// Project import
import { getRandomUser, getProductsArray } from "../../utils/getRandomData";
import Logger from "../../components/Logger";

// MUI import
import {
  Autocomplete,
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Delete as DeleteIcon } from "@mui/icons-material";

const CartForm = () => {
  const [loading, setLoading] = useState(false);

  const productsSchema = z.object({
    customer: z
      .object({
        id: z.number().positive(),
        firstName: z.string(),
        lastName: z.string(),
      })
      .strict(),
    products: z
      .array(
        z
          .object({
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
          })
          .strict(),
      )
      .nonempty({ message: "Please add at least one product" }),
  });

  type CustomerType = z.infer<typeof productsSchema>["customer"];

  type ProductType = z.infer<typeof productsSchema>["products"][number];

  type FormType = z.infer<typeof productsSchema>;

  const [customers, setCustomers] = useState<CustomerType[] | null>(null);

  useEffect(() => {
    const getUsers = async () => {
      try {
        const data = await fetch("https://dummyjson.com/users");
        const json = (await data.json()) as { users: CustomerType[] };
        const customerNames = json?.users.map((user) => ({
          id: user?.id,
          firstName: user?.firstName,
          lastName: user?.lastName,
        }));
        return customerNames;
      } catch (err) {
        console.error("Error while getting users data:", err);
      }
    };

    void getUsers().then((customersData) => {
      setCustomers(customersData ?? null);
    });
  }, []);

  const {
    control,
    handleSubmit,
    watch,
    formState: { isLoading, isSubmitSuccessful, isSubmitting, errors },
    reset,
  } = useForm<FormType>({
    defaultValues: { customer: undefined, products: [] },
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
      customer: formData.customer,
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
      reset({ customer: undefined, products: [] });
    }
  }, [isSubmitSuccessful, fields, remove, reset]);

  const fillWithRandomData = useCallback(async () => {
    setLoading(true);

    const products = await getProductsArray();

    const { id } = await getRandomUser();
    const customer = customers?.find(
      (customer: CustomerType) => customer.id === id,
    );

    reset({
      customer,
      products,
    });

    setLoading(false);
  }, [customers, reset]);

  return (
    <Stack
      id="array-form"
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      autoComplete="off"
      spacing={2}
    >
      <Typography variant="h4">Array Form</Typography>
      <Button
        onClick={fillWithRandomData}
        type="button"
        variant="outlined"
        size="small"
      >
        Fill with random data
      </Button>
      <Controller
        control={control}
        name="customer"
        render={({ field: { ref, ...fieldProps } }) => (
          <Autocomplete
            id="form-customer"
            value={fieldProps.value ?? null}
            onChange={(event, value) => fieldProps.onChange(value)}
            options={customers ?? []}
            noOptionsText={"No customers"}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            getOptionLabel={({ id, firstName, lastName }) =>
              id ? `#${id} ${firstName} ${lastName}` : ""
            }
            handleHomeEndKeys
            renderInput={(params) => (
              <TextField
                {...params}
                id="customer-field"
                label="Customer"
                inputRef={ref}
                InputLabelProps={{ shrink: true }}
                autoFocus={!!errors.customer}
                error={!!errors.customer}
                helperText={errors.customer?.message}
                disabled={loading || isLoading || isSubmitting}
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {isLoading || isSubmitting || loading ? (
                        <InputAdornment position="end">
                          <CircularProgress color="inherit" size={20} />
                        </InputAdornment>
                      ) : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
                margin="normal"
                fullWidth
              />
            )}
          />
        )}
      />
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
                disabled={loading || isLoading || isSubmitting}
                InputProps={{
                  endAdornment: (
                    <>
                      {(loading || isLoading || isSubmitting) && (
                        <InputAdornment position="end">
                          <CircularProgress color="inherit" size={20} />
                        </InputAdornment>
                      )}
                    </>
                  ),
                }}
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
                disabled={loading || isLoading || isSubmitting}
                InputProps={{
                  inputProps: { min: 1 },
                  endAdornment: (
                    <>
                      {(loading || isLoading || isSubmitting) && (
                        <InputAdornment position="end">
                          <CircularProgress color="inherit" size={20} />
                        </InputAdornment>
                      )}
                    </>
                  ),
                }}
                sx={{ maxWidth: "5rem" }}
              />
            )}
          />
          <IconButton
            onClick={() => remove(index)}
            disabled={loading || isLoading || isSubmitting}
          >
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
        disabled={loading || isLoading || isSubmitting}
      >
        Add Product
      </Button>
      <Button
        type="submit"
        variant="contained"
        disabled={loading || isLoading || isSubmitting}
      >
        Submit
      </Button>
      <Logger value={watch()} />
    </Stack>
  );
};

export default CartForm;
