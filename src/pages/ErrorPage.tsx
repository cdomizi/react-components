import { Box, Button, Typography } from "@mui/material";
import { useNavigate, useRouteError } from "react-router-dom";
import { CustomError } from "types";

const ErrorInfo = () => {
  const error = useRouteError() as CustomError;

  // Only log errors in development mode
  import.meta.env.DEV && console.error(error);

  return (
    <>
      <Typography variant="h2" gutterBottom>
        {(error.status && `${error.status}`) || "Unexpected Error"}
        {error.statusText && `: ${error.statusText}hi`}
      </Typography>
      <Typography>
        {error?.data ? `${error.data}` : "Sorry, an error occurred."}
      </Typography>
    </>
  );
};

const BackToHomeButton = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ width: "100%", height: "100%", textAlign: "center" }}>
      <Button
        variant="contained"
        size="large"
        sx={{ marginTop: "20%" }}
        onClick={() => navigate("/")}
      >
        Back to Home
      </Button>
    </Box>
  );
};

const ErrorPage = () => (
  <Box p={6}>
    <ErrorInfo />
    <BackToHomeButton />
  </Box>
);

export default ErrorPage;
