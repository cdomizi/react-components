import { Card, CardContent, SxProps } from "@mui/material";

interface ContentCardProps {
  children: JSX.Element;
  sx?: SxProps;
}

const ContentCard = ({ children, sx }: ContentCardProps) => {
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

export default ContentCard;
