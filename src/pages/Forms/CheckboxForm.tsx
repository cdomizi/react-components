import { useCallback, useEffect, useMemo } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

import { Logger } from "../../components/Logger";

// MUI import
import {
  Button,
  Checkbox,
  FormControlLabel,
  Stack,
  Typography,
} from "@mui/material";

const formSchema = z
  .object({
    status: z.boolean(),
  })
  .strict();

type FormInputsType = z.infer<typeof formSchema>;

export const CheckboxForm = () => {
  const initialFormState = useMemo(() => ({ status: false }), []);

  const {
    control,
    formState: { isSubmitSuccessful },
    handleSubmit,
    reset,
    watch,
  } = useForm<FormInputsType>({
    defaultValues: initialFormState,
    resolver: zodResolver(formSchema),
  });

  const onSubmit = useCallback((formData: FormInputsType) => {
    console.log(formData);
  }, []);

  useEffect(() => {
    // Reset the form on successful submit
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
        render={({ field: { ref, value, ...fieldProps } }) => (
          <FormControlLabel
            {...fieldProps}
            control={<Checkbox inputRef={ref} checked={value} />}
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
