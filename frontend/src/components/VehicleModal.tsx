import {
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  Stack,
  InputAdornment,
  IconButton,
} from "@mui/material";
import type { Vehicle } from "../types";
import { createEmptyVehicle } from "../types";
import React, { useState } from "react";
import ActionButtons from "./ActionButtons";
import SearchIcon from "@mui/icons-material/Search";

interface props {
  vehicle?: Vehicle;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleSave: (updatedVehicle: Vehicle) => Promise<void>;
}

const formSx = {
  display: "flex",
  flexDirection: "column",
  gap: "1rem",
};

const VIN_LENGTH = 17;

export default function VehicleModal({
  vehicle,
  open,
  setOpen,
  handleSave,
}: props) {
  const [localVehicle, setLocalVehicle] = useState(
    vehicle ?? createEmptyVehicle(),
  );
  const [saveButtonLoading, setSaveButtonLoading] = useState(false);

  function onFormChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;

    setLocalVehicle((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function onSaveButtonClick() {
    // check vin length
    if (
      localVehicle.vin &&
      localVehicle.vin.trim().length > 0 &&
      localVehicle.vin.trim().length != VIN_LENGTH
    )
      alert("Vehicle vin must be 17 characters.");
    else {
      setSaveButtonLoading(true);
      await handleSave(localVehicle);
      setSaveButtonLoading(false);
      setOpen(false);

      // if no vehicle was passed to this component, we need to clear local state
      // so next time this modal opens, it starts blank
      if (vehicle == null) setLocalVehicle(createEmptyVehicle());
    }
  }

  function onCancelButtonClick() {
    setOpen(false);

    // if no vehicle was passed to this component, we need to clear local state
    // so next time this modal opens, it starts blank
    if (vehicle == null) setLocalVehicle(createEmptyVehicle());
  }

  async function decodeVin() {
    try {
      const results = await fetch(
        `https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVinValues/${localVehicle.vin}?format=json`,
      );

      if (!results.ok) {
        alert(`VIN decoder server returned an error: ${results.statusText}`);
        return;
      }

      const info = (await results.json()).Results[0];

      if (Number(info.ErrorCode) !== 0) {
        alert("VIN not found");
        return;
      }

      setLocalVehicle((prev) => ({
        ...prev,
        year: Number(info.ModelYear),
        make: toTitleCase(info.Make),
        model: info.Model,
        engine: `${roundString1Decimal(info.DisplacementL)} L`,
      }));
    } catch (error) {
      alert("Error reaching VIN decoder server");
      console.log(error);
    }
  }

  function toTitleCase(input: string) {
    return input.toLowerCase().replace(/\b\w/g, (c: string) => c.toUpperCase());
  }

  function roundString1Decimal(input: string) {
    return parseFloat(input).toFixed(1);
  }

  return (
    <Dialog open={open} fullWidth>
      <DialogTitle>Vehicle Info</DialogTitle>
      <DialogContent>
        <Stack sx={formSx}>
          <TextField
            variant="filled"
            label="Year"
            name="year"
            value={localVehicle.year}
            onChange={onFormChange}
          ></TextField>
          <TextField
            variant="filled"
            label="Make"
            name="make"
            value={localVehicle.make}
            onChange={onFormChange}
          ></TextField>
          <TextField
            variant="filled"
            label="Model"
            name="model"
            value={localVehicle.model}
            onChange={onFormChange}
          ></TextField>
          <TextField
            variant="filled"
            label="Engine"
            name="engine"
            value={localVehicle.engine}
            onChange={onFormChange}
          ></TextField>
          <TextField
            variant="filled"
            label="VIN"
            name="vin"
            value={localVehicle.vin}
            onChange={onFormChange}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      disabled={localVehicle.vin?.length !== VIN_LENGTH}
                      onClick={decodeVin}
                    >
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          ></TextField>
          <TextField
            variant="filled"
            label="Notes"
            multiline
            name="notes"
            minRows={3}
            maxRows={6}
            value={localVehicle.notes}
            onChange={onFormChange}
          ></TextField>
          <ActionButtons
            positiveText="Save"
            negativeText="Cancel"
            onPositiveClick={onSaveButtonClick}
            onNegativeClick={onCancelButtonClick}
            positiveLoading={saveButtonLoading}
          />
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
