import { zodResolver } from "@hookform/resolvers/zod";
import { useAppLocation } from "hooks/useAppLocation";
import { useCallback, useEffect, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { LoginSchema, LoginType } from "types";

// MUI components
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Divider,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

const Login = () => {
  const navigate = useNavigate();
  const { state } = useAppLocation();
  const from = state?.from?.pathname || "/";

  const initialFormState = useMemo(() => ({ username: "", password: "" }), []);

  const {
    control,
    formState: { errors, isLoading, isSubmitSuccessful, isSubmitting },
    handleSubmit,
    reset,
  } = useForm<LoginType>({
    defaultValues: initialFormState,
    resolver: zodResolver(LoginSchema),
  });

  const onSubmit = useCallback(
    (formData: LoginType) => {
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

  // Reset form fields on successful login
  useEffect(() => {
    if (isSubmitSuccessful) reset(initialFormState);
  }, [initialFormState, isSubmitSuccessful, reset]);

  return (
    <Box sx={{ maxWidth: "24rem", mx: "auto", mt: 6 }}>
      <Stack
        id="login-form"
        component="form"
        onSubmit={handleSubmit(onSubmit)}
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
              InputLabelProps={{ required: true }}
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
          Log in
        </Button>
      </Stack>
      <Divider sx={{ my: 3 }}>
        <Typography color="text.disabled">
          Don&#8217;t have an account?
        </Typography>
      </Divider>
      <Button
        type="button"
        onClick={() => navigate("/signup")}
        disabled={isLoading || isSubmitting}
        endIcon={
          (isLoading || isSubmitting) && (
            <CircularProgress color="inherit" size={20} />
          )
        }
        variant="outlined"
        fullWidth
      >
        Create an account
      </Button>
    </Box>
  );
};

export default Login;
