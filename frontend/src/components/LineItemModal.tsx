import {
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  Grid,
} from "@mui/material";
import { useEffect, useState } from "react";
import ActionButtons from "./ActionButtons";
import type { LabourLineItem, PartLineItem, PaymentLineItem } from "../types";

interface props {
  open: boolean;
  title: string;
  data?: LabourLineItem | PartLineItem | PaymentLineItem | undefined;
  onCancel: () => void;
  onSave: (name: string, cost: number) => void;
}

const contentSx = {
  display: "flex",
  flexDirection: "column",
};

export default function LineItemModal({
  open,
  title,
  data,
  onCancel,
  onSave,
}: props) {
  const [description, setDescription] = useState(data?.name ?? "");
  const [amount, setAmount] = useState(data?.cost ?? 0);

  // change the modal sate whenever the passed data changes
  useEffect(() => {
    function reset() {
      setDescription(data?.name ?? "");
      setAmount(data?.cost ?? 0);
    }

    reset();
  }, [data]);

  function handleCancel() {
    onCancel();
    resetState();
  }

  function handleSave() {
    onSave(description, amount);
    resetState();
  }

  function resetState() {
    // only reset modal to empty if no data was passed
    // necessary when opening modal with the same data twice in a row
    // if data has changed, it will get handled in the useEffect hook
    if (!data) {
      setDescription("");
      setAmount(0);
    }
  }

  return (
    <Dialog open={open}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent sx={contentSx}>
        <Grid container spacing={1}>
          <Grid size={9}>
            <TextField
              size="small"
              value={description}
              fullWidth
              variant="filled"
              label="Description"
              onChange={(e) => setDescription(e.target.value)}
            />
          </Grid>
          <Grid size={3}>
            <TextField
              size="small"
              value={amount}
              variant="filled"
              label="Cost"
              type="number"
              onChange={(e) => setAmount(Number.parseFloat(e.target.value))}
            />
          </Grid>
        </Grid>
        <ActionButtons
          onPositiveClick={handleSave}
          onNegativeClick={handleCancel}
          positiveText="Save"
          negativeText="Cancel"
        />
      </DialogContent>
    </Dialog>
  );
}
