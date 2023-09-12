import React, { useCallback, useRef, useState } from "react";
import { z, ZodError } from "zod";
import getRandomData from "../../utils/getRandomData";

import { Button, Stack, TextField, Typography } from "@mui/material";

interface FormErrors {
  username?: boolean;
  email?: boolean;
}

const TestForm = () => {
  const userSchema = z.object({
    username: z
      .string()
      .min(3, { message: "Username must be at least 3 characters long" }),
    email: z.string().email({ message: "Please enter a valid email address" }),
  });

  type User = z.infer<typeof userSchema>;

  const formRef = useRef<HTMLFormElement>(null!);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  const fillWithRandomData = useCallback(async () => {
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
    setIsSubmitted(true);

    // Create FormData object
    const formData = new FormData(formRef.current);
    const userData = Object.fromEntries(formData);

    try {
      const result = userSchema.parse(userData);
      console.log(result);
      // Reset form on successful submit
      const formElement = Object.values(formRef.current);
      const formInputs = formElement.filter((el) => el?.id?.length);
      formInputs.forEach((input) => {
        input.setAttribute("value", "");
      });
      formRef.current.reset();
      return setIsSubmitted(false);
    } catch (err) {
      if (err instanceof ZodError) {
        err.issues.forEach((issue) => {
          const field = issue.path[0];
          setFormErrors((prevErrors) => ({
            ...prevErrors,
            [field]: true,
          }));
        });
      }
    }
  }, []);

  const checkError = (key: "username" | "email", value?: string) => {
    if (isSubmitted) {
      try {
        const check = userSchema.parse({
          [key]: value,
        });
        setFormErrors((prevErrors) => ({
          ...prevErrors,
          [key]: !check[key],
        }));
      } catch (err) {
        console.log(err);
        if (err instanceof ZodError) {
          const isError = err.issues.find((issue) => issue.path[0] === key);
          setFormErrors((prevErrors) => ({
            ...prevErrors,
            [key]: !!isError,
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
        onChange={(event) => checkError("username", event.target.value)}
        InputLabelProps={{ required: true, shrink: true }}
        error={!!formErrors?.username}
        helperText={
          formErrors?.username && "Username must be at least 3 characters long"
        }
        fullWidth
        margin="normal"
      />
      <TextField
        id="email"
        name="email"
        label="Email"
        onChange={(event) => checkError("email", event.target.value)}
        InputLabelProps={{ required: true, shrink: true }}
        error={!!formErrors?.email}
        helperText={formErrors?.email && "Please enter a valid email address"}
        fullWidth
        margin="normal"
      />
      <Button
        type="button"
        variant="outlined"
        size="small"
        sx={{ my: 2 }}
        onClick={fillWithRandomData}
      >
        Fill with random data
      </Button>
      <Button variant="contained" type="submit">
        Submit
      </Button>
    </Stack>
  );
};

export default TestForm;
