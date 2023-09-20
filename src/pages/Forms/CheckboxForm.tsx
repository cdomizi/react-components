import { useCallback, useEffect, useMemo } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, SubmitHandler, useForm } from "react-hook-form";

// Project import
import Logger from "../../components/Logger";

// MUI import
import {
  Button,
  Checkbox,
  FormControlLabel,
  Stack,
  Typography,
} from "@mui/material";

const CheckboxForm = () => {
  const formSchema = z.object({
    status: z.boolean(),
  });

  type UserType = z.infer<typeof formSchema>;

  const initialFormState = useMemo(() => ({ status: false }), []);

  const {
    control,
    formState: { isSubmitSuccessful },
    handleSubmit,
    reset,
    watch,
  } = useForm<UserType>({
    defaultValues: initialFormState,
    resolver: zodResolver(formSchema),
  });

  const onSubmit: SubmitHandler<UserType> = useCallback((formData) => {
    console.log(formData);
  }, []);

  useEffect(() => {
    isSubmitSuccessful && reset();
  });

  return (
    <Stack
      id="checkbox-form"
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      autoComplete="off"
      spacing={2}
    >
      <Typography variant="h4">Checkbox Form</Typography>
      <Controller
        control={control}
        name="status"
        render={({ field }) => (
          <FormControlLabel
            {...field}
            control={<Checkbox />}
            label="Accept Terms & Conditions"
          />
        )}
      />
      <Button type="submit" variant="contained">
        Submit
      </Button>
      <Logger value={watch()} />
    </Stack>
  );
};

export default CheckboxForm;
