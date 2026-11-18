import { Typography, Stack, Box, IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ServiceHistoryCard from "../components/ServiceHistoryCard";
import type { NewWorkOrderRequest, WorkOrder } from "../types";
import NewWorkOrderModal from "../components/NewWorkOrderModal";
import { useState } from "react";
import { useStore } from "../store";
import { makeRequest } from "../apiClient";
import Spinner from "../components/Spinner";

const headerSx = {
  width: "100%",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const listSx = {
  px: "1rem",
  gap: "1rem",
  overflowY: "auto",
};

export default function ServiceHistorySection() {
  const workOrders = useStore((state) => state.workOrders);
  const workOrdersLoading = useStore((state) => state.workOrdersLoading);
  const selectedVehicleIndex = useStore((state) => state.selectedVehicleIndex);
  const selectedCustomer = useStore((state) => state.getSelectedCustomer());

  const createWorkOrderInStore = useStore((state) => state.createWorkOrder);
  const [openModal, setOpenModal] = useState(false);

  function handleModalCancel() {
    setOpenModal(false);
  }

  async function handleModalSave(date: string) {
    setOpenModal(false);
    const newWorkOrder: NewWorkOrderRequest = {
      date: date,
    };
    await createWorkOrder(newWorkOrder);
  }

  async function createWorkOrder(newWorkOrder: NewWorkOrderRequest) {
    if (selectedCustomer && workOrders) {
      const vehicleId =
        selectedCustomer.vehicles[selectedVehicleIndex].vehicleId;
      const path = "/vehicles/" + vehicleId + "/work_orders";

      const newWorkOrderResponse = await makeRequest<WorkOrder>(
        "POST",
        path,
        newWorkOrder,
      );
      if (newWorkOrderResponse !== null)
        createWorkOrderInStore(newWorkOrderResponse);
    }
  }

  return (
    <Stack height={"100%"}>
      <Box sx={headerSx}>
        <Typography variant="h5">Service History</Typography>
        <IconButton
          color="primary"
          onClick={() => setOpenModal(true)}
          disabled={selectedVehicleIndex === -1}
        >
          <AddIcon />
        </IconButton>
      </Box>

      <Stack sx={listSx}>
        {!workOrdersLoading && workOrders?.length === 0 && (
          <Typography align="center">Empty...</Typography>
        )}
        <Spinner spin={workOrdersLoading} />
        {workOrders?.map((workOrder) => (
          <ServiceHistoryCard
            key={workOrder.workOrderId}
            workOrder={workOrder}
          />
        ))}
      </Stack>

      <NewWorkOrderModal
        open={openModal}
        onCancel={handleModalCancel}
        onSave={handleModalSave}
      />
    </Stack>
  );
}
