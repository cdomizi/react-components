import React, { useCallback, useMemo, useState } from "react";
import { z, ZodError } from "zod";
import getRandomData from "../../utils/getRandomData";
import Logger from "../../components/Logger";

import {
  Button,
  CircularProgress,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

interface FormErrors {
  username?: string;
  email?: string;
}

const ControlledForm = () => {
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
    email: z
      .string()
      .email({ message: "Please enter a valid email address" })
      .optional(),
  });

  type User = z.infer<typeof userSchema>;

  const initialState = useMemo(
    () => ({
      username: "",
      email: undefined,
    }),
    [],
  );
  const [userData, setUserData] = useState<User>(initialState);

  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formErrors, setFormErrors] = useState<FormErrors>(initialState);

  const fillWithRandomData = useCallback(async () => {
    setIsLoading(true);

    setFormErrors({
      ...formErrors,
      username: undefined,
      email: undefined,
    });
    const randomUser = (await getRandomData()) as User;
    setUserData({
      ...userData,
      username: randomUser.username,
      email: randomUser.email,
    });

    setIsLoading(false);
  }, [formErrors, userData]);

  const checkErrors = useCallback(
    (key: string) => {
      if (isSubmitted) {
        try {
          userSchema.parse(userData);
          setFormErrors({
            ...formErrors,
            [key]: undefined,
          });
        } catch (err) {
          if (err instanceof ZodError) {
            const error = err.issues.find((issue) => issue.path[0] === key);
            setFormErrors({
              ...formErrors,
              [key]: error?.message,
            });
          }
        }
      }
    },
    [formErrors, isSubmitted, userData, userSchema],
  );

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = event.target;
      setUserData({ ...userData, [name]: value });
      checkErrors(name);
    },
    [checkErrors, userData],
  );

  const handleSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setIsLoading(true);
      setIsSubmitted(true);

      try {
        const result = userSchema.parse(userData);
        console.log(result);
        // Reset form on successful submit
        setUserData(initialState);

        return (function cleanUp() {
          setIsSubmitted(false);
          setIsLoading(false);
        })();
      } catch (err) {
        if (err instanceof ZodError) {
          const errors = err.flatten().fieldErrors;
          for (const error in errors) {
            console.error(`Error: ${errors?.[error]?.[0]}`);
            setFormErrors({
              ...formErrors,
              [error]: errors[error]?.[0],
            });
          }
        }
        setIsLoading(false);
      }
    },
    [formErrors, initialState, userData, userSchema],
  );

  return (
    <Stack
      id="controlled-form"
      component="form"
      onSubmit={handleSubmit}
      autoComplete="off"
      spacing={2}
    >
      <Typography variant="h4">Controlled Form</Typography>
      <TextField
        id="username"
        name="username"
        label="Username"
        value={userData.username || ""}
        onChange={handleChange}
        InputLabelProps={{ required: true, shrink: true }}
        autoFocus={!!formErrors?.username}
        error={!!formErrors?.username}
        helperText={formErrors?.username}
        disabled={isLoading}
        InputProps={{
          endAdornment: (
            <>
              {isLoading && (
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
        id="email"
        name="email"
        label="Email"
        value={userData.email ?? ""}
        onChange={handleChange}
        InputLabelProps={{ shrink: true }}
        autoFocus={!!formErrors?.email}
        error={!!formErrors?.email}
        helperText={formErrors?.email}
        disabled={isLoading}
        InputProps={{
          endAdornment: (
            <>
              {isLoading && (
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
        disabled={isLoading}
        endIcon={isLoading && <CircularProgress color="inherit" size={20} />}
        variant="outlined"
        size="small"
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
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
      <Logger value={userData} />
    </Stack>
  );
};

export default ControlledForm;
