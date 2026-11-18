import { Dialog, DialogTitle, DialogContent, Typography } from "@mui/material";
import ActionButtons from "./ActionButtons";

interface props {
  open: boolean;
  title: string;
  text?: string;
  onYesClick: () => void;
  onNoClick: () => void;
}

export default function YesNoModal({
  open,
  title,
  text,
  onYesClick,
  onNoClick,
}: props) {
  return (
    <Dialog open={open}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Typography variant="body1">{text}</Typography>
        <ActionButtons
          positiveText="No"
          negativeText="Yes"
          onPositiveClick={onNoClick}
          onNegativeClick={onYesClick}
        />
      </DialogContent>
    </Dialog>
  );
}
