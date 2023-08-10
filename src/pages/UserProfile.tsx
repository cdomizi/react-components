import { memo } from "react";
import { Box, Typography } from "@mui/material";

const UserDetail = memo(
  ({ item, value, id }: { item: string; value: string; id: string }) => (
    <Typography paragraph id={id}>
      {`${item}: `}
      <Box component="span" fontWeight="bold">
        {value}
      </Box>
    </Typography>
  )
);

const UserProfile = () => {
  return (
    <Box mx={3}>
      <Typography variant="h2" mb={5}>
        Profile
      </Typography>
      <UserDetail item="User ID" value="User ID here" id="userID" />
      <UserDetail item="Username" value="Username here" id="username" />
      <UserDetail item="Password" value="Password here" id="userPassword" />
    </Box>
  );
};

export default UserProfile;
