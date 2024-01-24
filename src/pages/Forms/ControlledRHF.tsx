import { DevTool } from "@hookform/devtools";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";

// Project import
import { Logger } from "components/Logger";
import { userSchema, UserType } from "types";
import { getRandomData } from "utils/getRandomData";

// MUI import
import {
  Button,
  CircularProgress,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

export const ControlledRHF = () => {
  const initialFormState = useMemo(() => ({ username: "", email: "" }), []);

  const [loading, setLoading] = useState(false);

  const {
    control,
    formState: { errors, isLoading, isSubmitSuccessful, isSubmitting },
    handleSubmit,
    reset,
    watch,
  } = useForm<UserType>({
    defaultValues: initialFormState,
    resolver: zodResolver(userSchema),
  });

  const fillWithRandomData = useCallback(async () => {
    setLoading(true);

    const { username, email } = await getRandomData<UserType>(
      "https://dummyjson.com/users",
    );
    reset({ username, email });

    setLoading(false);
  }, [reset]);

  function onSubmit(formData: UserType) {
    console.log(formData);
  }

  useEffect(() => {
    if (isSubmitSuccessful) reset(initialFormState);
  }, [initialFormState, isSubmitSuccessful, reset]);

  return (
    <Stack
      id="controlled-rhf-form"
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      autoComplete="off"
      spacing={2}
    >
      <Typography variant="h4">Controlled RHF</Typography>
      <Controller
        control={control}
        name="username"
        render={({ field: { ref, ...fieldProps } }) => (
          <TextField
            {...fieldProps}
            id="username"
            inputRef={ref}
            label="Username"
            InputLabelProps={{ required: true, shrink: true }}
            autoFocus={!!errors?.username}
            error={!!errors?.username}
            helperText={errors?.username?.message}
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
            fullWidth
            margin="normal"
          />
        )}
      />
      <Controller
        control={control}
        name="email"
        render={({ field: { ref, ...fieldProps } }) => (
          <TextField
            {...fieldProps}
            id="email"
            inputRef={ref}
            label="Email"
            InputLabelProps={{ shrink: true }}
            autoFocus={!!errors?.email}
            error={!!errors?.email}
            helperText={errors?.email?.message}
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
            fullWidth
            margin="normal"
          />
        )}
      />
      <Button
        type="button"
        disabled={loading || isLoading || isSubmitting}
        endIcon={
          (loading || isLoading || isSubmitting) && (
            <CircularProgress color="inherit" size={20} />
          )
        }
        variant="outlined"
        size="small"
        onClick={fillWithRandomData}
      >
        Fill with random data
      </Button>
      <Button
        type="submit"
        disabled={loading || isLoading || isSubmitting}
        endIcon={
          (loading || isLoading || isSubmitting) && (
            <CircularProgress color="inherit" size={20} />
          )
        }
        variant="contained"
      >
        Submit
      </Button>
      <Logger value={watch()} />
      <DevTool control={control} />
    </Stack>
  );
};
