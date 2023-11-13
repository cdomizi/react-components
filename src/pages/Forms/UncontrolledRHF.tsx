import { useCallback, useEffect, useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

// Project import
import { userSchema, UserType } from "../../types";
import { getRandomData } from "../../utils/getRandomData";
import { Logger } from "../../components/Logger";

// MUI import
import {
  Button,
  CircularProgress,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

export const UncontrolledRHF = () => {
  const initialFormState = useMemo(() => ({ username: "", email: "" }), []);

  const [loading, setLoading] = useState(false);

  const {
    formState: { errors, isLoading, isSubmitSuccessful, isSubmitting },
    handleSubmit,
    register,
    reset,
    watch,
  } = useForm<UserType>({
    defaultValues: initialFormState,
    resolver: zodResolver(userSchema),
  });

  const { ref: usernameRef, ...usernameRegisterProps } = register("username");
  const { ref: emailRef, ...emailRegisterProps } = register("email");

  const fillWithRandomData = useCallback(async () => {
    setLoading(true);

    const { username, email } = await getRandomData<UserType>(
      "https://dummyjson.com/users/",
    );
    reset({ username, email });

    setLoading(false);
  }, [reset]);

  const onSubmit = useCallback((formData: UserType) => {
    console.log(formData);
  }, []);

  useEffect(() => {
    if (isSubmitSuccessful) reset(initialFormState);
  });

  return (
    <Stack
      id="uncontrolled-rhf-form"
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      autoComplete="off"
      spacing={2}
    >
      <Typography variant="h4">Uncontrolled RHF</Typography>
      <TextField
        {...usernameRegisterProps}
        id="username"
        label="Username"
        inputRef={usernameRef}
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
      <TextField
        {...emailRegisterProps}
        id="email"
        label="Email"
        inputRef={emailRef}
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
    </Stack>
  );
};
