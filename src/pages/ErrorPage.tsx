import { useNavigate, useRouteError } from "react-router-dom";
import { Box, Button, Typography } from "@mui/material";

type CustomError = Error & {
  data?: string;
  status?: number;
  statusText?: string;
};

const ErrorPage = () => {
  const navigate = useNavigate();
  const error = useRouteError() as CustomError;
  console.error(error);

  return (
    <Box p={6}>
      <Typography variant="h2" gutterBottom>
        {(error.status && `${error.status}`) || "Unexpected Error"}
        {error.statusText && `: ${error.statusText}`}
      </Typography>
      <Typography>{`${error.data}` || "Sorry, an error occurred."}</Typography>
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
    </Box>
  );
};

export default ErrorPage;
