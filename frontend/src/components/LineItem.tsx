import { Typography, IconButton, Box } from "@mui/material";
import LineItemModal from "./LineItemModal";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useState } from "react";
import type { LineItemType } from "../types";
import YesNoModal from "./YesNoModal";

interface props {
  type: LineItemType;
  name: string;
  cost: number;
  editMode: boolean;
  updateLineItem: (
    type: LineItemType,
    index: number,
    name: string,
    cost: number,
  ) => void;
  deleteLineItem: (index: number) => void;
  index: number;
}

const componentContainerSx = {
  width: "100%",
  borderBottom: "1px solid rgb(216, 216, 216)",
};

const lineSx = {
  display: "flex",
  justifyContent: "space-between",
};

export default function LineItem({
  type,
  name,
  cost,
  editMode,
  updateLineItem,
  deleteLineItem,
  index,
}: props) {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  function openModal() {
    setEditModalOpen(true);
  }

  function closeModal() {
    setEditModalOpen(false);
  }

  function saveLineItem(description: string, cost: number) {
    updateLineItem(type, index, description, cost);
    closeModal();
  }

  function handleDeleteLineItem() {
    setDeleteModalOpen(false);
    deleteLineItem(index);
  }

  return (
    <Box sx={componentContainerSx}>
      <Box sx={lineSx}>
        <Typography>{name}</Typography>
        <Box display={"flex"}>
          <Typography>${cost}</Typography>
          <Box display={editMode ? "inline" : "none"}>
            <IconButton color="warning" size="small" onClick={openModal}>
              <EditIcon/>
            </IconButton>
            <IconButton
              color="error"
              size="small"
              onClick={() => setDeleteModalOpen(true)}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        </Box>
      </Box>

      {/*edit modal*/}
      <LineItemModal
        open={editModalOpen}
        title="Edit"
        data={{ name: name, cost: cost }}
        onCancel={closeModal}
        onSave={saveLineItem}
      />

      {/*Confirm delete work order modal*/}
      <YesNoModal 
      open={deleteModalOpen}
      title={"Delete " +  type + " item?"}
      text={name + " | $" + cost}
      onNoClick={() => setDeleteModalOpen(false)}
      onYesClick={handleDeleteLineItem}
      />
    </Box>
  );
}
