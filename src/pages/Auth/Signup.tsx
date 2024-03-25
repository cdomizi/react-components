import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { SignupSchema, SignupType } from "types";

// MUI components
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { ZodError } from "zod";

const Signup = () => {
  const navigate = useNavigate();

  const initialFormState = useMemo(
    () => ({ username: "", password: "", confirmPassword: "" }),
    [],
  );

  const {
    control,
    formState: { errors, isLoading, isSubmitSuccessful, isSubmitting },
    handleSubmit,
    reset,
    setError,
  } = useForm<SignupType>({
    defaultValues: initialFormState,
    resolver: zodResolver(SignupSchema),
  });

  const onSubmit = useCallback(
    (formData: SignupType) => {
      try {
        // Validate form data
        SignupSchema.parse(formData);

        console.log(formData);

        // Redirect user to Home page
        navigate("/");

        return;
      } catch (err) {
        if (err instanceof ZodError) {
          err.issues.forEach((error) => {
            // Display error helper text in the appropriate fields
            setError(error.path[0] as keyof typeof errors, {
              message: error.message,
            });

            console.error(`Error ${error.path[0]}: ${error.message}`);
          });
        } else console.error(err);
      }
    },
    [navigate, setError],
  );

  // Reset form fields on successful signup
  useEffect(() => {
    if (isSubmitSuccessful) reset(initialFormState);
  }, [initialFormState, isSubmitSuccessful, reset]);

  return (
    <Box sx={{ maxWidth: "24rem", mx: "auto", mt: 6 }}>
      <Stack
        id="register-form"
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        spacing={3}
        autoComplete="off"
        textAlign="center"
      >
        <Typography variant="h2">Sign Up</Typography>
        <Controller
          control={control}
          name="username"
          render={({ field: { ref, ...fieldProps } }) => (
            <TextField
              {...fieldProps}
              id="username"
              inputRef={ref}
              label="Username"
              InputLabelProps={{ required: true }}
              autoFocus={!!errors?.username}
              error={!!errors?.username}
              helperText={errors?.username?.message}
              disabled={isLoading || isSubmitting}
              InputProps={{
                endAdornment: (
                  <>
                    {(isLoading || isSubmitting) && (
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
          name="password"
          render={({ field: { ref, ...fieldProps } }) => (
            <TextField
              {...fieldProps}
              id="password"
              inputRef={ref}
              type="password"
              label="Password"
              autoFocus={!!errors?.password}
              error={!!errors?.password}
              helperText={errors?.password?.message}
              disabled={isLoading || isSubmitting}
              InputProps={{
                endAdornment: (
                  <>
                    {(isLoading || isSubmitting) && (
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
          name="confirmPassword"
          render={({ field: { ref, ...fieldProps } }) => (
            <TextField
              {...fieldProps}
              id="confirmPassword"
              inputRef={ref}
              type="password"
              label="Confirm Password"
              autoFocus={!!errors?.confirmPassword}
              error={!!errors?.confirmPassword}
              helperText={errors?.confirmPassword?.message}
              disabled={isLoading || isSubmitting}
              InputProps={{
                endAdornment: (
                  <>
                    {(isLoading || isSubmitting) && (
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
          type="submit"
          disabled={isLoading || isSubmitting}
          endIcon={
            (isLoading || isSubmitting) && (
              <CircularProgress color="inherit" size={20} />
            )
          }
          variant="contained"
          fullWidth
        >
          Create an account
        </Button>
      </Stack>
      <Divider sx={{ my: 3 }}>
        <Typography color="text.disabled">Already have an account?</Typography>
      </Divider>
      <Button
        type="button"
        onClick={() => navigate("/login")}
        disabled={isLoading || isSubmitting}
        endIcon={
          (isLoading || isSubmitting) && (
            <CircularProgress color="inherit" size={20} />
          )
        }
        variant="outlined"
        fullWidth
      >
        Log in
      </Button>
    </Box>
  );
};

export default Signup;
