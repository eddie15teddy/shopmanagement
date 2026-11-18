import { Button, Box } from "@mui/material";

interface props {
  positiveText: string;
  negativeText: string;
  onPositiveClick: () => void;
  onNegativeClick: () => void;
  positiveLoading?: boolean;
  negativeLoading?: boolean;
}

const buttonBoxSx = {
  display: "flex",
  justifyContent: "right",
  paddingTop: ".25rem",
};

export default function ActionButtons({
  positiveText,
  negativeText,
  onPositiveClick,
  onNegativeClick,
  positiveLoading = false,
  negativeLoading = false,
}: props) {
  return (
    <Box sx={buttonBoxSx}>
      <Button color="error" onClick={onNegativeClick} loading={negativeLoading}>
        {negativeText}
      </Button>
      <Button onClick={onPositiveClick} loading={positiveLoading}>
        {positiveText}
      </Button>
    </Box>
  );
}
