import { useState } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import type { Vehicle } from "../types";
import VehicleModal from "./VehicleModal";

interface props {
  vehicle: Vehicle;
  selected: boolean;
  updateVehicle: (editedVehicle: Vehicle) => Promise<void>;
}

const headerSx = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

export default function VehicleCard({
  vehicle,
  selected,
  updateVehicle,
}: props) {
  const containerSx = {
    padding: ".5rem",
    margin: ".5rem",
    borderRadius: "10px",
    border: selected ? "3px solid blue" : "1px solid gray",
    boxShadow: "0px 3px 3px rgba(0, 0, 0, 0.25)",
    background: selected ? "rgb(240, 240, 240)" : "",
    transition: "all 0.2s ease-in-out",

    "&:hover": {
      boxShadow: "0px 3px 3px rgba(0, 0, 0, 0.5)",
    },
  };

  const [modelOpen, setModalOpen] = useState(false);

  function onEditButtonClick(e: React.MouseEvent<HTMLButtonElement>) {
    e.stopPropagation();
    setModalOpen(true);
  }

  async function handleSave(newVehicle: Vehicle) {
    await updateVehicle(newVehicle);
  }

  return (
    <Box sx={containerSx}>
      <Box sx={headerSx}>
        <Typography variant="h6">
          {vehicle.year} {vehicle.make} {vehicle.model}
        </Typography>
        <IconButton onClick={(e) => onEditButtonClick(e)}>
          <EditIcon sx={{ height: "20ßpx", width: "20px" }} />
        </IconButton>
      </Box>
      <Typography variant="body1">Engine: {vehicle.engine}</Typography>
      <Box display={"flex"}>
        <Typography variant="body1">VIN: {vehicle.vin?.slice(0, 9)}</Typography>
        <Typography variant="body1" fontWeight={700}>
          {vehicle.vin?.slice(9)}
        </Typography>
      </Box>
      <Typography variant="body1">Notes: {vehicle.notes}</Typography>
      <VehicleModal
        key={vehicle.vehicleId}
        open={modelOpen}
        setOpen={setModalOpen}
        vehicle={vehicle}
        handleSave={handleSave}
      />
    </Box>
  );
}
