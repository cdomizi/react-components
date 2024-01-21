import { Card, CardContent, SxProps } from "@mui/material";

type ContentCardProps = {
  children: React.ReactNode;
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
