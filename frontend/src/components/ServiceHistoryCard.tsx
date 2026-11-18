import { useEffect, useState } from "react";
import {
  Typography,
  Stack,
  Box,
  Button,
  TextField,
  FormControlLabel,
  Checkbox,
  IconButton,
} from "@mui/material";
import PrintIcon from "@mui/icons-material/Print";
import LineItem from "./LineItem";
import type {
  LabourLineItem,
  LineItemType,
  PartLineItem,
  PaymentLineItem,
  UpdateWorkOrderRequest,
  WorkOrder,
} from "../types";
import { createUpdateWorkOrderRequest } from "../types";
import LineItemModal from "./LineItemModal";
import YesNoModal from "./YesNoModal";
import { makeRequest } from "../apiClient";
import { useStore } from "../store";

interface props {
  workOrder: WorkOrder;
}

const componentSx = {
  border: "1px solid gray",
  borderRadius: "10px",
  padding: ".5rem",
  background: "rgb(240, 240, 240)",
};

const totalsBox = {
  display: "flex",
  justifyContent: "space-between",
};

const itemListSx = {
  px: "1rem",
  whiteSpace: "pre-wrap",
};

const headingSx = {
  display: "flex",
  justifyContent: "space-between",
};

const spacerSx = {
  height: "1rem",
};

function convertDateString(date: string): string {
  const dateObj = new Date(date + "T00:00:00");

  return dateObj.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function ServiceHistoryCard({ workOrder }: props) {
  const updateWorkOrderInStore = useStore((state) => state.updateWorkOrder);
  const deleteWorkOrderInStore = useStore((state) => state.deleteWorkOrder);

  const [localWorkOrder, setLocalWorkOrder] = useState(workOrder);
  const [deleteButtonLoading, setDeleteButtonLoading] = useState(false);
  const [saveButtonLoading, setSaveButtonLoading] = useState(false);
  const [printButtonLoading, setPrintButtonLoading] = useState(false);

  useEffect(() => {
    setLocalWorkOrder(workOrder);
  }, [workOrder]);

  const [editMode, setEditMode] = useState(false);
  const [lineItemModalOpen, setLineItemModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  // the type of the line item being edited
  const [lineItemType, setLineItemType] = useState<LineItemType>();
  const [lineItemModalTitle, setLineItemModalTitle] = useState("");

  async function updateWorkOrder(workOrder: UpdateWorkOrderRequest): Promise<boolean> {
    const path = "/work_orders/" + workOrder.workOrderId;

    const returnedWorkOrder = await makeRequest<WorkOrder>(
      "PUT",
      path,
      workOrder,
    );

    if (returnedWorkOrder !== null) {
      updateWorkOrderInStore(returnedWorkOrder);
      setLocalWorkOrder(returnedWorkOrder);
      return true;
    }
    return false;
  }

  async function deleteWorkOrder(workOrderId: number) {
    const path = "/work_orders/" + workOrderId;

    const result = await makeRequest<void>("DELETE", path);
    if (result !== null) {
      deleteWorkOrderInStore(workOrderId);
    }
  }

  async function editOrSavePressed() {
    if (editMode) {
      setSaveButtonLoading(true);
      const request = createUpdateWorkOrderRequest(localWorkOrder);
      const success = await updateWorkOrder(request);
      setSaveButtonLoading(false);

      if(success)
        setEditMode(false);
    } else {
    setEditMode((prev) => !prev);
    }
  }

  async function handleWorkOrderDelete() {
    setDeleteModalOpen(false);
    setDeleteButtonLoading(true);
    await deleteWorkOrder(workOrder.workOrderId);
    setDeleteButtonLoading(false);
  }

  function handleNotesEdit(event: React.ChangeEvent<HTMLInputElement>) {
    setLocalWorkOrder((prev: WorkOrder) => ({
      ...prev,
      notes: event.target.value,
    }));
  }

  function toggleTaxFreeCheckbox() {
    setLocalWorkOrder((prev) => ({
      ...prev,
      taxFree: !prev.taxFree,
    }));
  }

  // labour line item functions
  function updateLabourLineItem(index: number, item: LabourLineItem) {
    const labourLineItemList = [...localWorkOrder.labour];
    labourLineItemList[index] = item;

    setLocalWorkOrder((prev) => ({
      ...prev,
      labour: labourLineItemList,
    }));
  }

  function deleteLabourLineItem(index: number) {
    setLocalWorkOrder((prev: WorkOrder) => ({
      ...prev,
      labour: prev.labour.filter((_, i) => i !== index),
    }));
  }

  function addLabourLineItem(name: string, cost: number) {
    const newLine: LabourLineItem = {
      name,
      cost,
    };

    setLocalWorkOrder((prev: WorkOrder) => ({
      ...prev,
      labour: [...prev.labour, newLine],
    }));
  }

  function openLabourModal() {
    setLineItemModalTitle("New Labour Item");
    setLineItemType("labour");
    setLineItemModalOpen(true);
  }

  // parts line item functions
  function updatePartsLineItem(index: number, item: PartLineItem) {
    const partsLineItemList = [...localWorkOrder.parts];
    partsLineItemList[index] = item;

    setLocalWorkOrder((prev) => ({
      ...prev,
      parts: partsLineItemList,
    }));
  }

  function deletePartsLineItem(index: number) {
    setLocalWorkOrder((prev: WorkOrder) => ({
      ...prev,
      parts: prev.parts.filter((_, i) => i !== index),
    }));
  }

  function addPartLineItem(name: string, cost: number) {
    const newLine: PartLineItem = {
      name,
      cost,
    };

    setLocalWorkOrder((prev: WorkOrder) => ({
      ...prev,
      parts: [...prev.parts, newLine],
    }));
  }

  function openPartsModal() {
    setLineItemModalTitle("New Parts Item");
    setLineItemType("parts");
    setLineItemModalOpen(true);
  }

  // payment line item functions
  function updatePaymentLineItem(index: number, item: PaymentLineItem) {
    const paymentsLineItemList = [...localWorkOrder.payments];
    paymentsLineItemList[index] = item;

    setLocalWorkOrder((prev) => ({
      ...prev,
      payments: paymentsLineItemList,
    }));
  }

  function deletePaymentLineItem(index: number) {
    setLocalWorkOrder((prev: WorkOrder) => ({
      ...prev,
      payments: prev.payments.filter((_, i) => i !== index),
    }));
  }

  function addPaymentLineItem(name: string, cost: number) {
    const newLine: PaymentLineItem = {
      name: name,
      cost: cost,
    };

    setLocalWorkOrder((prev: WorkOrder) => ({
      ...prev,
      payments: [...prev.payments, newLine],
    }));
  }

  function openPaymentModal() {
    setLineItemModalTitle("New Payment");
    setLineItemType("payment");
    setLineItemModalOpen(true);
  }

  function handleLineItemUpdate(
    type: LineItemType,
    index: number,
    name: string,
    cost: number,
  ) {
    if (type == "labour") updateLabourLineItem(index, { name, cost });
    else if (type == "parts") updatePartsLineItem(index, { name, cost });
    else if (type == "payment") updatePaymentLineItem(index, { name, cost });
  }

  function handleModalSave(name: string, cost: number) {
    setLineItemModalOpen(false);

    if (lineItemType === "labour") addLabourLineItem(name, cost);
    else if (lineItemType === "parts") addPartLineItem(name, cost);
    else if (lineItemType === "payment") addPaymentLineItem(name, cost);
  }

  function onModalCancel() {
    setEditMode(false);
    setLocalWorkOrder(workOrder);
  }

  async function handlePrintButtonClick() {
    const path = "/work_orders/" + workOrder.workOrderId + "/invoice";

    setPrintButtonLoading(true);
    const blob = await makeRequest<Blob>("GET", path, undefined, "blob");
    setPrintButtonLoading(false);

    if (blob === null) return null;

    const pdfUrl = URL.createObjectURL(blob);

    window.open(pdfUrl, "_blank");
  }

  const deleteButtonSx = {
    display: editMode ? "inline" : "none",
  };

  const totalSx = {
    flexDirection: "row",
    alignItems: "center",
    gap: "10px",
    display: editMode ? "none" : "flex",
  };

  let paymentStatus = "PAYMENT IN PROGRESS";
  let paymentStatusColor = "#F58008";
  if (localWorkOrder.amountDue <= 0) {
    paymentStatus = "PAID IN FULL";
    paymentStatusColor = "#028800";
  } else if (localWorkOrder.paymentsTotal == 0) {
    paymentStatus = "NOT PAID";
    paymentStatusColor = "#d72000";
  }

  return (
    <Stack sx={componentSx}>
      <Box sx={headingSx}>
        <Typography variant="h6">
          {convertDateString(localWorkOrder.date)}
        </Typography>
        {!editMode && (
          <Typography color={paymentStatusColor}>{paymentStatus}</Typography>
        )}
      </Box>

      {editMode && (
        <FormControlLabel
          control={
            <Checkbox
              checked={localWorkOrder.taxFree}
              onChange={toggleTaxFreeCheckbox}
            />
          }
          label="Tax Free"
        />
      )}

      <Box sx={spacerSx} />

      <Box sx={headingSx}>
        <Typography fontWeight={700}>Labour</Typography>
        {!editMode && (
          <Typography fontWeight={700}>
            ${localWorkOrder.labourTotal}
          </Typography>
        )}
      </Box>
      <Stack sx={itemListSx}>
        {localWorkOrder.labour.map((workItem, index) => (
          <LineItem
            type="labour"
            key={index}
            index={index}
            name={workItem.name}
            cost={workItem.cost}
            editMode={editMode}
            updateLineItem={handleLineItemUpdate}
            deleteLineItem={deleteLabourLineItem}
          />
        ))}
        <Box display={editMode ? "inline" : "none"}>
          <Button onClick={openLabourModal}>ADD</Button>
        </Box>
      </Stack>

      <Box sx={spacerSx} />

      <Box sx={headingSx}>
        <Typography fontWeight={700}>Parts</Typography>
        {!editMode && (
          <Typography fontWeight={700}>${localWorkOrder.partsTotal}</Typography>
        )}
      </Box>
      <Stack sx={itemListSx}>
        {localWorkOrder.parts.map((partItem, index) => (
          <LineItem
            type="parts"
            key={index}
            index={index}
            name={partItem.name}
            cost={partItem.cost}
            editMode={editMode}
            updateLineItem={handleLineItemUpdate}
            deleteLineItem={deletePartsLineItem}
          />
        ))}
        <Box display={editMode ? "inline" : "none"}>
          <Button onClick={openPartsModal}>ADD</Button>
        </Box>
      </Stack>

      <Box sx={spacerSx} />

      <Box sx={headingSx}>
        <Typography fontWeight={700}>Payments</Typography>
      </Box>
      <Stack sx={itemListSx}>
        {localWorkOrder.payments.map((item, index) => (
          <LineItem
            type="payment"
            key={index}
            index={index}
            name={item.name}
            cost={item.cost}
            editMode={editMode}
            updateLineItem={handleLineItemUpdate}
            deleteLineItem={deletePaymentLineItem}
          />
        ))}
        <Box display={editMode ? "inline" : "none"}>
          <Button onClick={openPaymentModal}>ADD</Button>
        </Box>
      </Stack>

      <Box sx={spacerSx} />
      <Typography fontWeight={700}>Notes</Typography>
      <Typography sx={itemListSx} display={editMode ? "none" : "inline"}>
        {localWorkOrder.notes}
      </Typography>
      <TextField
        sx={{ ...itemListSx, display: editMode ? "inline" : "none" }}
        value={localWorkOrder.notes}
        onChange={handleNotesEdit}
        fullWidth
        multiline
      />

      <Box sx={spacerSx} />
      <Box sx={totalsBox}>
        <Stack sx={totalSx}>
          <Typography>Subtotal: ${localWorkOrder.subtotal}</Typography>
          <Typography>Tax: ${localWorkOrder.taxAmount} </Typography>
          <Typography fontWeight={700}>
            Total: ${localWorkOrder.grandTotal}
          </Typography>

          <Typography>Paid: ${localWorkOrder.paymentsTotal}</Typography>
          {localWorkOrder.amountDue > 0 && (
            <Typography fontWeight={700}>
              Due: ${localWorkOrder.amountDue}
            </Typography>
          )}
        </Stack>
        <Button
          color="error"
          sx={deleteButtonSx}
          onClick={() => setDeleteModalOpen(true)}
          loading={deleteButtonLoading}
        >
          Delete
        </Button>
        <Button color="warning" sx={deleteButtonSx} onClick={onModalCancel}>
          Cancel
        </Button>
        <Box>
          <Button onClick={editOrSavePressed} loading={saveButtonLoading}>
            {editMode ? "Save" : "Edit"}
          </Button>
          {!editMode && (
            <IconButton
              onClick={handlePrintButtonClick}
              loading={printButtonLoading}
            >
              <PrintIcon />
            </IconButton>
          )}
        </Box>
      </Box>
      <LineItemModal
        open={lineItemModalOpen}
        title={lineItemModalTitle}
        onSave={handleModalSave}
        onCancel={() => setLineItemModalOpen(false)}
      />
      <YesNoModal
        key={workOrder.workOrderId}
        open={deleteModalOpen}
        title="Delete this work order?"
        onYesClick={handleWorkOrderDelete}
        onNoClick={() => setDeleteModalOpen(false)}
      />
    </Stack>
  );
}
