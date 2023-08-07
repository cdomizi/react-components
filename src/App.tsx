// Project import
import CustomAppBar from "./components/CustomAppBar";

// Mui components
import { Box, Toolbar, Typography } from "@mui/material";

const App = () => {
  return (
    <div className="App">
      <CustomAppBar />
      <Box mx={3}>
        <Toolbar />
        <Typography variant="h2">Home</Typography>
      </Box>
    </div>
  );
};

export default App;
