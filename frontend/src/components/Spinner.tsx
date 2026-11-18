import { Box, CircularProgress } from "@mui/material";

interface props {
  spin: boolean;
}

export default function Spinner({ spin }: props) {
  const containerSx = {
    display: spin ? "flex" : "none",
    justifyContent: "center",
    paddingTop: "1rem",
  };
  return (
    <Box sx={containerSx}>
      <CircularProgress />
    </Box>
  );
}
