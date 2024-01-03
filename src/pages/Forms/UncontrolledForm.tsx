import { useCallback, useRef, useState } from "react";
import { ZodError, ZodIssue, z } from "zod";
import { getRandomData } from "../../utils/getRandomData";

// MUI import
import {
  Button,
  CircularProgress,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

// Form validation schema
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
      .trim()
      .email({ message: "Please enter a valid email address" })
      // Accept empty string
      .or(z.string().length(0))
      .optional()
      // Return undefined in case of empty string
      .transform((val) => (val === "" ? undefined : val)),
  })
  .strict();

type UserType = z.infer<typeof userSchema>;

type FormErrors = {
  username?: string;
  email?: string;
};

type ZodErrorType = {
  issues: ZodIssue[];
};

export const UncontrolledForm = () => {
  const formRef = useRef<HTMLFormElement>(null!);

  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  const fillWithRandomData = useCallback(async () => {
    setFormErrors({ ...formErrors, username: undefined, email: undefined });
    const randomUser = await getRandomData<UserType>(
      "https://dummyjson.com/users/",
    );
    const formElement = Object.values(formRef.current);
    const formInputs = formElement.filter(
      (el: HTMLInputElement) => el?.id?.length,
    );
    formInputs.forEach((input: HTMLInputElement) => {
      const key = input.id as "username" | "email";
      input.setAttribute("value", randomUser[key] ?? "");
    });
  }, [formErrors]);

  const handleSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      setIsLoading(true);
      setIsSubmitted(true);

      // Create FormData object
      const formData = new FormData(formRef.current);
      const userData = Object.fromEntries(formData);

      const formElement = Object.values(formRef.current);
      const formInputs = formElement.filter(
        (el: HTMLInputElement) => el?.id?.length,
      ) as HTMLInputElement[];

      try {
        const result = userSchema.parse(userData);
        // On successful submit, log data to the console
        console.log(result);
        // On successful submit, reset form
        formInputs.forEach((input) => {
          input.setAttribute("value", "");
        });
        formRef.current.reset();
        return (function cleanUp(): void {
          setIsSubmitted(false);
          setIsLoading(false);
        })();
      } catch (err) {
        if (err instanceof ZodError) {
          const errors = err as ZodErrorType;
          const flatErrors = err.flatten().fieldErrors;
          for (const error in flatErrors) {
            console.error(`Error: ${flatErrors?.[error]?.[0]}`);
            setFormErrors({
              ...formErrors,
              [error]: flatErrors[error]?.[0],
            });
          }
          // Set focus on first form field with error
          formInputs
            .find((input) => input.id === errors.issues[0].path[0])
            ?.focus();
        }
        setIsLoading(false);
      }
    },
    [formErrors],
  );

  const checkError = (key: "username" | "email", value?: string) => {
    if (isSubmitted) {
      try {
        userSchema.parse({
          [key]: value,
        });
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
  };

  return (
    <Stack
      id="uncontrolled-form"
      component="form"
      onSubmit={handleSubmit}
      ref={formRef}
      autoComplete="off"
      spacing={2}
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
