import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useEffect } from "react";

// MUI import
import {
  Box,
  Button,
  Divider,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

interface formInputs {
  username: string;
  password: string;
  confirmPassword: string;
}

const Register = () => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitSuccessful },
    watch,
  } = useForm<formInputs>({
    defaultValues: { username: "", password: "", confirmPassword: "" },
  });

  const onSubmit: SubmitHandler<formInputs> = (formData) => {
    console.log(formData);
  };

  useEffect(() => {
    // Reset on submit
    if (isSubmitSuccessful) reset();
  }, [isSubmitSuccessful]);

  return (
    <Box mx={3} width="22rem">
      <Typography variant="h2">Register</Typography>
      <Stack
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        mt={6}
        spacing={2}
      >
        <Controller
          control={control}
          name="username"
          rules={{ required: "Please enter a username" }}
          render={({ field }) => (
            <TextField
              {...field}
              required
              id="username"
              label="Username"
              error={!!errors?.username}
              helperText={errors?.username && errors?.username?.message}
              margin="normal"
            />
          )}
        />
        <Controller
          control={control}
          rules={{ required: "Please enter a password" }}
          name="password"
          render={({ field }) => (
            <TextField
              {...field}
              required
              id="password"
              label="Password"
              error={!!errors?.password}
              helperText={errors?.password && errors?.password?.message}
              type="password"
              margin="normal"
            />
          )}
        />
        <Controller
          control={control}
          rules={{
            required: "Please confirm the password",
            validate: (val: string) =>
              val === watch("password") || "The two password do not match",
          }}
          name="confirmPassword"
          render={({ field }) => (
            <TextField
              {...field}
              required
              id="confirmPassword"
              label="Confirm Password"
              error={!!errors?.confirmPassword}
              helperText={
                errors?.confirmPassword && errors?.confirmPassword?.message
              }
              type="password"
              margin="normal"
            />
          )}
        />
        <Button type="submit" variant="contained">
          Submit
        </Button>
      </Stack>
      <Divider sx={{ my: 4 }}>Already have an account?</Divider>
      <Button type="button" variant="outlined" href="login" fullWidth>
        Log in
      </Button>
    </Box>
  );
};

export default Register;
