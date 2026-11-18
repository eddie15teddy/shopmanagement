import { Dialog, DialogTitle, DialogContent } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import ActionButtons from "./ActionButtons";
import { useState } from "react";
import dayjs from "dayjs";

interface props {
  open: boolean;
  onCancel: () => void;
  onSave: (date: string) => Promise<void>;
}

export default function NewWorkOrderModal({ open, onCancel, onSave }: props) {
  const [date, setDate] = useState(dayjs().startOf("day"));
  const [createButtonLoading, setCreateButtonLoading] = useState(false);

  async function handleSave() {
    setCreateButtonLoading(true);
    await onSave(date.format("YYYY-MM-DD"));
    setCreateButtonLoading(false);
    clearLocalState();
  }

  function handleCancel() {
    onCancel();
    clearLocalState();
  }

  function clearLocalState() {
    setDate(dayjs().startOf("day"));
  }

  return (
    <Dialog open={open}>
      <DialogTitle>New Service Date</DialogTitle>
      <DialogContent>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            value={date}
            onChange={(newValue) => setDate(newValue ?? date)}
          />
        </LocalizationProvider>
        <ActionButtons
          positiveText="Create"
          negativeText="Cancel"
          onPositiveClick={handleSave}
          onNegativeClick={handleCancel}
          positiveLoading={createButtonLoading}
        />
      </DialogContent>
    </Dialog>
  );
}
