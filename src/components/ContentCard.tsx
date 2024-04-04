import { Card, CardContent, SxProps } from "@mui/material";
import { PropsWithChildren } from "react";

type ContentCardProps = PropsWithChildren & {
  sx?: SxProps;
};

export const ContentCard = ({ children, sx }: ContentCardProps) => {
  return (
    <Card
      sx={{
        ...sx,
        border: "1px solid",
        borderColor: "divider",
      }}
    >
      <CardContent>{children}</CardContent>
    </Card>
  );
};
