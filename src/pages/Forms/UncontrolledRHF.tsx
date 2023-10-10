import { useCallback, useEffect, useMemo, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";

// Project import
import getRandomData from "../../utils/getRandomData";
import Logger from "../../components/Logger";

// MUI import
import {
  Button,
  CircularProgress,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

const UncontrolledRHF = () => {
  const userSchema = z
    .object({
      username: z
        .string({
          required_error: "Username is required",
        })
        .trim()
        .min(3, { message: "Username must be at least 3 characters long" })
        .max(20, { message: "Username max. 20 characters" })
        .regex(/^[a-z0-9-_]+$/i, {
          message: "Only use letters, numbers, dashes and underscores",
        }),
      email: z
        .string()
        .trim()
        .email({ message: "Please enter a valid email address" })
        // Accept empty string
        .or(z.string().length(0))
        .optional()
        // Return undefined in case of empty string
        .transform((val) => (val === "" ? undefined : val)),
    })
    .strict();

  type UserType = z.infer<typeof userSchema>;

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

  const onSubmit: SubmitHandler<UserType> = useCallback((formData) => {
    console.log(formData);
  }, []);

  useEffect(() => {
    isSubmitSuccessful && reset();
  });

  return (
    <Stack
      id="uncontrolled-rhf-form"
      component="form"
      onSubmit={() => void handleSubmit(onSubmit)}
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
        onClick={() => void fillWithRandomData()}
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

export default UncontrolledRHF;
