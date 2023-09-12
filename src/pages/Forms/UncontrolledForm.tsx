import React, { useCallback, useRef, useState } from "react";
import { z, ZodError } from "zod";
import getRandomData from "../../utils/getRandomData";

import {
  Button,
  CircularProgress,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

interface FormErrors {
  username?: string;
  email?: string;
}

const UncontrolledForm = () => {
  // Form validation schema
  const userSchema = z.object({
    username: z
      .string({
        required_error: "Username is required",
      })
      .trim()
      .min(3, { message: "Username must be at least 3 characters long" })
      .max(20, { message: "Username must be less than 20 characters long" })
      .regex(/^[a-z0-9-_]+$/i, {
        message: "Only use letters, numbers, dashes and underscores",
      }),
    email: z.string().email({ message: "Please enter a valid email address" }),
  });

  type User = z.infer<typeof userSchema>;

  const formRef = useRef<HTMLFormElement>(null!);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  const fillWithRandomData = useCallback(async () => {
    setFormErrors((prevErrors) => ({
      ...prevErrors,
      username: undefined,
      email: undefined,
    }));
    const randomUser = (await getRandomData()) as User;
    const formElement = Object.values(formRef.current);
    const formInputs = formElement.filter((el) => el?.id?.length);
    formInputs.forEach((input) => {
      const key = input.id as "username" | "email";
      input.setAttribute("value", randomUser[key]);
    });
  }, []);

  const handleSubmit = useCallback((event: React.FormEvent) => {
    event.preventDefault();

    setIsLoading(true);
    setIsSubmitted(true);

    // Create FormData object
    const formData = new FormData(formRef.current);
    const userData = Object.fromEntries(formData);

    try {
      const result = userSchema.parse(userData);
      // On successful submit, log data to the console
      console.log(result);
      // On successful submit, reset form
      const formElement = Object.values(formRef.current);
      const formInputs = formElement.filter((el) => el?.id?.length);
      formInputs.forEach((input) => {
        input.setAttribute("value", "");
      });
      formRef.current.reset();
      return (function cleanUp() {
        setIsSubmitted(false);
        setIsLoading(false);
      })();
    } catch (err) {
      if (err instanceof ZodError) {
        const errors = err.flatten().fieldErrors;
        for (const error in errors) {
          console.error(`Error: ${errors?.[error]?.[0]}`);
          setFormErrors((prevErrors) => ({
            ...prevErrors,
            [error]: errors[error]?.[0],
          }));
        }
      }
      setIsLoading(false);
    }
  }, []);

  const checkError = (key: "username" | "email", value?: string) => {
    if (isSubmitted) {
      try {
        userSchema.parse({
          [key]: value,
        });
        setFormErrors((prevErrors) => ({
          ...prevErrors,
          [key]: undefined,
        }));
      } catch (err) {
        if (err instanceof ZodError) {
          const error = err.issues.find((issue) => issue.path[0] === key);
          setFormErrors((prevErrors) => ({
            ...prevErrors,
            [key]: error?.message,
          }));
        }
      }
    }
  };

  return (
    <Stack
      component="form"
      onSubmit={handleSubmit}
      ref={formRef}
      autoComplete="off"
    >
      <Typography variant="h4">Uncontrolled Form</Typography>
      <TextField
        id="username"
        name="username"
        label="Username"
        defaultValue=""
        onChange={(event) => checkError("username", event.target.value)}
        InputLabelProps={{ required: true, shrink: true }}
        error={!!formErrors?.username}
        helperText={formErrors?.username}
        fullWidth
        margin="normal"
      />
      <TextField
        id="email"
        name="email"
        label="Email"
        defaultValue=""
        onChange={(event) => checkError("email", event.target.value)}
        InputLabelProps={{ shrink: true }}
        error={!!formErrors?.email}
        helperText={formErrors?.email}
        fullWidth
        margin="normal"
      />
      <Button
        type="button"
        disabled={isLoading}
        endIcon={isLoading && <CircularProgress color="inherit" size={20} />}
        variant="outlined"
        size="small"
        sx={{ my: 2 }}
        onClick={fillWithRandomData}
      >
        Fill with random data
      </Button>
      <Button
        type="submit"
        disabled={isLoading}
        endIcon={isLoading && <CircularProgress color="inherit" size={20} />}
        variant="contained"
      >
        Submit
      </Button>
    </Stack>
  );
};

export default UncontrolledForm;
