import { Box, Typography } from "@mui/material";
import type { Customer } from "../types";

interface props {
    customer: Customer,
    selected: boolean
}

const headerSx = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center"
};

function maskPhoneNumber(phoneNumber: string): string {
  
  // test if phone number is 10 digits [0-9]
  if (phoneNumber.length == 10 && /^[0-9]+$/.test(phoneNumber)) {
    const areaCode = phoneNumber.slice(0, 3);
    const telephonePrefix = phoneNumber.slice(3, 6);
    const lineNumber = phoneNumber.slice(6)

    return `(${areaCode}) ${telephonePrefix}-${lineNumber}`;
  }

  // return original number otherwise
  return phoneNumber;
}

export default function CustomerCard({
  customer,
  selected,
}: props) {
  const containerSx = {
    padding: ".5rem",
    borderRadius: "10px",
    border: selected ? "3px solid blue" : "1px solid gray",
    boxShadow: "0px 3px 3px rgba(0, 0, 0, 0.25)",
    background: selected ? "rgb(240, 240, 240)" : "",
    transition: "all 0.2s ease-in-out",

    "&:hover": {
      boxShadow: "0px 3px 3px rgba(0, 0, 0, 0.5)",
    },
  };

  return (
    <Box sx={containerSx}>
      <Box sx={headerSx}>
        <Typography variant="h6">{customer.firstName} {customer.lastName} </Typography>
      </Box>
      <Typography variant="body1">Phone Number: {maskPhoneNumber(customer.phoneNumber)}</Typography>

      {customer.totalOwing > 0 && <Typography variant="body1" color="red">Total Owing: ${customer.totalOwing}</Typography> } 
      {customer.notes &&  <Typography variant="body1">Notes: {customer.notes}</Typography>} 
      {customer.vehicles.map(vehicle => (
      <Typography fontWeight={700} key={vehicle.vehicleId} variant="body1">{vehicle.year} {vehicle.make} {vehicle.model}</Typography>
      ))}
    </Box>
  );
}
