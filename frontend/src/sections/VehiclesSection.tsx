import { useState } from "react";
import { Stack, Typography, Box, IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

import VehicleCard from "../components/VehicleCard";
import VehicleModal from "../components/VehicleModal";
import type { Vehicle, WorkOrder } from "../types";
import { useStore } from "../store";
import { makeRequest } from "../apiClient";

const containerSx = {
  height: "100%",
};

const headerSx = {
  width: "100%",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  paddingRight: "7px",
};

const vehicleListStackSx = {
  display: "flex",
  flexDirection: "column",
  flex: 1,
  overflowY: "auto",
  paddingRight: "7px",
};

export default function VehiclesSection() {
  const selectedCustomer = useStore((store) => store.getSelectedCustomer());
  const vehicles = selectedCustomer?.vehicles ?? [];
  const selectedVehicleIndex = useStore((store) => store.selectedVehicleIndex);
  const addNewVehicleToStore = useStore(
    (state) => state.addNewVehicleToSelectedCustomer,
  );
  const updateVehicleInStore = useStore(
    (state) => state.updateVehicleOfSelectedCustomer,
  );
  const setSelectedVehicleIndex = useStore(
    (state) => state.setSelectedVehicleIndex,
  );
  const setWorkOrders = useStore((state) => state.setWorkOrders);
  const setWorkOrdersLoading = useStore((state) => state.setWorkOrdersLoading);

  const [vehicleInfoModalOpen, setVehicleModalInfoOpen] = useState(false);

  async function addNewVehicle(newVehicle: Vehicle) {
    const path = "/customers/" + selectedCustomer?.phoneNumber + "/vehicles";

    const returnedVehicle = await makeRequest<Vehicle>(
      "POST",
      path,
      newVehicle,
    );
    if (returnedVehicle != null) addNewVehicleToStore(returnedVehicle);
  }

  async function updateVehicle(newVehicle: Vehicle) {
    const path = "/vehicles/" + newVehicle.vehicleId;

    const returnedVehicle = await makeRequest<Vehicle>("PUT", path, newVehicle);
    if (returnedVehicle !== null) updateVehicleInStore(returnedVehicle);
  }

  async function getWokOrders(vehicleId: number): Promise<WorkOrder[] | null> {
    const path = "/vehicles/" + vehicleId + "/work_orders";

    const workOrders = await makeRequest<WorkOrder[]>("GET", path);
    if (workOrders === null) return null;
    return workOrders;
  }

  async function handleVehicleSelection(index: number, vehicleId: number) {
    setSelectedVehicleIndex(index);

    // get work orders
    setWorkOrdersLoading(true);
    const result = await getWokOrders(vehicleId);
    if (result) setWorkOrders(result);
    else setWorkOrders([]);
  }

  return (
    <Stack sx={containerSx}>
      <Box sx={headerSx}>
        <Typography variant="h5">Vehicles</Typography>
        <IconButton
          disabled={selectedCustomer?.phoneNumber === ""}
          color="primary"
          onClick={() => setVehicleModalInfoOpen(true)}
        >
          <AddIcon />
        </IconButton>
      </Box>
      <Stack sx={vehicleListStackSx}>
        {vehicles.map((vehicle: Vehicle, index) => (
          <Box
            key={index}
            onClick={() =>
              handleVehicleSelection(index, vehicle.vehicleId ?? -1)
            }
          >
            <VehicleCard
              vehicle={vehicle}
              selected={selectedVehicleIndex == index}
              updateVehicle={updateVehicle}
              key={index}
            />
          </Box>
        ))}
      </Stack>
      <VehicleModal
        open={vehicleInfoModalOpen}
        setOpen={setVehicleModalInfoOpen}
        handleSave={addNewVehicle}
      />
    </Stack>
  );
}
