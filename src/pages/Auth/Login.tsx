import { useAppLocation } from "hooks/useAppLocation";
import { useCallback, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { AuthData } from "types";

// MUI components
import {
  Alert,
  Box,
  Button,
  Divider,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

const Login = () => {
  const navigate = useNavigate();
  const { state } = useAppLocation();
  const from = state?.from?.pathname || "/";

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitSuccessful },
    reset,
  } = useForm<AuthData>({
    defaultValues: { username: "", password: "" },
  });

  const onSubmit = useCallback(
    (formData: AuthData) => {
      try {
        // Log the user in
        console.log(formData);
        // Redirect user to previously requested route
        navigate(from, { replace: true });
        return;
      } catch (err) {
        console.error(err);
      }
    },
    [from, navigate],
  );

  useEffect(() => {
    // Reset form fields on successful login
    if (isSubmitSuccessful) reset();
  }, [isSubmitSuccessful, reset]);

  return (
    <Box sx={{ maxWidth: "24rem", mx: "auto", mt: 6 }}>
      <Stack
        onSubmit={handleSubmit(onSubmit)}
        component="form"
        id="login-form"
        spacing={3}
        autoComplete="off"
        textAlign="center"
      >
        <Typography variant="h2">Log In</Typography>
        {state?.sessionExpired && (
          <Alert
            severity="error"
            variant="outlined"
            sx={{ "& .MuiAlert-message": { pt: 1.3 } }}
          >
            Your session expired - <strong>log back in</strong>
          </Alert>
        )}
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
        <Button type="submit" variant="contained">
          Log In
        </Button>
      </Stack>
      <Divider sx={{ my: 3 }}>
        <Typography color="text.disabled">
          Don&#39;t have an account?
        </Typography>
      </Divider>
      <Button onClick={() => navigate("/signup")} variant="outlined" fullWidth>
        Create an account
      </Button>
    </Box>
  );
};

export default Login;
