import { useCallback, useMemo, useRef, useState } from "react";
import { z, ZodError, ZodIssue } from "zod";

import getRandomData from "../../utils/getRandomData";
import { Logger } from "../../components/Logger";

// MUI import
import {
  Button,
  CircularProgress,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

type FormErrors = {
  username?: string;
  email?: string;
};

type ZodErrorType = {
  issues: ZodIssue[];
};

export const ControlledForm = () => {
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
        .email({ message: "Please enter a valid email address" })
        .optional(),
    })
    .strict();

  type UserType = z.infer<typeof userSchema>;

  const initialState = useMemo(
    () => ({
      username: "",
      email: undefined,
    }),
    [],
  );
  const [userData, setUserData] = useState<UserType>(initialState);

  const formRef = useRef<HTMLFormElement>(null!);

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
    try {
      const randomUser = await getRandomData<UserType>(
        "https://dummyjson.com/users/",
      );
      setUserData({
        ...userData,
        username: randomUser.username,
        email: randomUser.email,
      });
    } catch (err) {
      console.error("Error while setting random data", err);
    }

    setIsLoading(false);
  }, [formErrors, userData]);

  const checkErrors = useCallback(
    (key: string, value: string) => {
      if (isSubmitted) {
        try {
          userSchema.parse({ ...userData, [key]: value });
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
      checkErrors(name, value);
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

        return (function cleanUp(): void {
          setIsSubmitted(false);
          setIsLoading(false);
        })();
      } catch (err) {
        if (err instanceof ZodError) {
          const errors = err as ZodErrorType;
          const flatErrors = err.flatten().fieldErrors;
          let newErrors = {};
          for (const error in flatErrors) {
            console.error(`Error: ${flatErrors?.[error]?.[0]}`);
            newErrors = {
              ...newErrors,
              [error]: flatErrors[error]?.[0],
            };
          }
          setFormErrors({
            ...formErrors,
            ...newErrors,
          });

          // Set focus on first form field with error
          const formElement = Object.values(formRef.current);
          const formInputs = formElement.filter(
            (el: HTMLInputElement) => el?.id?.length,
          ) as HTMLInputElement[];
          formInputs
            .find((input) => input.id === errors.issues[0].path[0])
            ?.focus();
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
      ref={formRef}
      autoComplete="off"
      spacing={2}
    >
      <Typography variant="h4">Controlled Form</Typography>
      <TextField
        id="username"
        name="username"
        label="Username"
        value={userData.username ?? ""}
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
