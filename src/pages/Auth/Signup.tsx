import { useCallback, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { AuthData } from "types";

// MUI components
import {
  Box,
  Button,
  Divider,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

const Signup = () => {
  const navigate = useNavigate();

  const {
    control,
    formState: { errors, isSubmitSuccessful },
    handleSubmit,
    reset,
    watch,
  } = useForm<AuthData>({
    defaultValues: { username: "", password: "", confirmPassword: "" },
  });

  const onSubmit = useCallback(
    (formData: AuthData) => {
      try {
        console.log(formData);

        navigate("/");
        return;
      } catch (err) {
        console.error(err);
      }
    },
    [navigate],
  );

  useEffect(() => {
    // Reset form on successful registration
    if (isSubmitSuccessful) reset();
  }, [isSubmitSuccessful, reset]);

  return (
    <Box sx={{ maxWidth: "24rem", mx: "auto", mt: 6 }}>
      <Stack
        onSubmit={handleSubmit(onSubmit)}
        component="form"
        id="register-form"
        spacing={3}
        autoComplete="off"
        textAlign="center"
      >
        <Typography variant="h2">Sign up</Typography>
        <Controller
          control={control}
          name="username"
          rules={{
            required: "Please enter your username",
            minLength: {
              value: 3,
              message: "Username must be at least 3 characters",
            },
          }}
          render={({ field: { ref, ...fieldProps } }) => (
            <TextField
              {...fieldProps}
              id="username"
              label="Username"
              inputRef={ref}
              error={!!errors?.username}
              helperText={errors?.username?.message}
              InputLabelProps={{ required: true }}
              fullWidth
              margin="normal"
            />
          )}
        />
        <Controller
          control={control}
          name="password"
          rules={{
            required: "Please enter your password",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters",
            },
          }}
          render={({ field: { ref, ...fieldProps } }) => (
            <TextField
              {...fieldProps}
              id="password"
              label="Password"
              inputRef={ref}
              type="password"
              error={!!errors?.password}
              helperText={errors?.password?.message}
              InputLabelProps={{ required: true }}
              fullWidth
              margin="normal"
            />
          )}
        />
        <Controller
          control={control}
          name="confirmPassword"
          rules={{
            required: "Please confirm your password",
            validate: (val) =>
              val === watch("password") || "Passwords do not match",
          }}
          render={({ field: { ref, ...fieldProps } }) => (
            <TextField
              {...fieldProps}
              id="confirmPassword"
              label="Confirm Password"
              inputRef={ref}
              type="password"
              error={!!errors?.confirmPassword}
              helperText={errors?.confirmPassword?.message}
              InputLabelProps={{ required: true }}
              fullWidth
              margin="normal"
            />
          )}
        />
        <Button type="submit" variant="contained">
          Create an account
        </Button>
      </Stack>
      <Divider sx={{ my: 3 }}>
        <Typography color="text.disabled">Already have an account?</Typography>
      </Divider>
      <Button onClick={() => navigate("/login")} variant="outlined" fullWidth>
        Log in
      </Button>
    </Box>
  );
};

export default Signup;
