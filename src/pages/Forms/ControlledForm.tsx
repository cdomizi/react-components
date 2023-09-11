import React, { useCallback, useRef, useState } from "react";

import { Button, Stack, TextField, Typography } from "@mui/material";

interface FormErrors {
  username?: boolean;
  email?: boolean;
}

const TestForm = () => {
  const formRef = useRef<HTMLFormElement>(null!);
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  const handleSubmit = useCallback((event: React.FormEvent) => {
    event.preventDefault();

    // Create FormData object
    const formData = new FormData(formRef.current);

    // Set errors for each empty field
    formData?.forEach((value, key) => {
      if (typeof value === "string")
        !value?.length &&
          setFormErrors((prevErrors) => ({ ...prevErrors, [key]: true }));
    });

    const formFields = [...formData.entries()];
    const currentErrors = formFields?.filter(([key, value]) => {
      if (typeof value === "string") return !value?.length;
    });

    if (currentErrors?.length) {
      // On error, log the list of missing fields to the console
      return console.error(
        "Missing fields:",
        currentErrors?.map(([key, value]) => key)?.join(", ")
      );
    } else {
      // On no error, log form data to the console
      console.log({ formData });
      // Cleanup after submit
      return formRef.current?.reset();
    }
  }, []);

  return (
    <Stack
      component="form"
      onSubmit={handleSubmit}
      ref={formRef}
      autoComplete="off"
    >
      <Typography variant="h4">Controlled Form</Typography>
      <TextField
        id="username"
        name="username"
        label="Username"
        onChange={(event) => {
          // Set error if field is empty
          setFormErrors((prevErrors) => ({
            ...prevErrors,
            username: !event.target?.value?.length,
          }));
        }}
        InputLabelProps={{ required: true }}
        error={formErrors?.username}
        helperText={formErrors?.username && "Please enter your username"}
        fullWidth
        margin="normal"
      />
      <TextField
        id="email"
        name="email"
        label="Email"
        type="email"
        onChange={(event) => {
          // Set error if field is empty
          setFormErrors((prevErrors) => ({
            ...prevErrors,
            email: !event.target?.value?.length,
          }));
        }}
        InputLabelProps={{ required: true }}
        error={formErrors?.email}
        helperText={formErrors?.email && "Please enter your email"}
        fullWidth
        margin="normal"
      />
      <Button variant="contained" type="submit">
        Submit
      </Button>
    </Stack>
  );
};

export default TestForm;
