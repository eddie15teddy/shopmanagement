import { useCallback, useEffect, useState } from "react";
import {
  Typography,
  TextField,
  Stack,
  Box,
  Button,
  Tabs,
  Tab,
} from "@mui/material";
import { createEmptyCustomer, type Customer } from "../types";
import CustomerCard from "../components/CustomerCard";
import { makeRequest } from "../apiClient";
import { useStore } from "../store";
import Spinner from "../components/Spinner";

const containerSx = {
  height: "100%",
};

const formSx = {
  display: "flex",
  flexDirection: "column",
  marginTop: "1rem",
  gap: "1rem",
};

const listSx = {
  display: "flex",
  flexDirection: "column",
  height: "87%",
  marginTop: "1rem",
  paddingRight: "10px",
  gap: "0.5rem",
  overflowY: "auto",
};

export default function LookupSection() {
  const allCustomers = useStore((state) => state.allCustomers);
  const setSelectedCustomerId = useStore(
    (state) => state.setSelectedCustomerId,
  );
  const setAllCustomers = useStore((state) => state.setAllCustomers);
  const updateSelectedCustomer = useStore(
    (state) => state.updateSelectedCustomer,
  );

  const [listLoading, setListLoading] = useState(true);
  const [saveButtonLoading, setSaveButtonLoading] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [resultMessage, setResultMessage] = useState("");
  const [selectedCustomerIndex, setSelectedCustomerIndex] = useState(-1);
  // whats held in the form. Might not be a real customer
  const [localCustomer, setLocalCustomer] = useState(createEmptyCustomer());

  // input in the first tab
  const [searchText, setSearchText] = useState("");
  const filteredCustomers = allCustomers.filter(filterCustomer);
  const openCustomers = allCustomers.filter((c) => c.totalOwing > 0);

  function fetchAllCustomers(): Promise<Customer[] | null> {
    return makeRequest<Customer[]>("GET", "/customers");
  }

  // fetches and sets all customers
  const loadAllCustomers = useCallback(async () => {
    const customer = await fetchAllCustomers();
    if (customer) setAllCustomers(customer);
  }, [setAllCustomers]);

  // get a list of all customers on component mount
  useEffect(() => {
    const load = async () => {
      setListLoading(true);

      try {
        await loadAllCustomers();
      } finally {
        setListLoading(false);
      }
    };

    void load();
  }, [loadAllCustomers]);

  function onFormChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setLocalCustomer((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function onSearchTextChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchText(e.target.value);
    unselectCustomer();
  }

  // filters customer by search text
  function filterCustomer(customer: Customer) {
    if (
      searchText == "" ||
      // includesIgnoreCase(customer.firstName, searchText) ||
      // includesIgnoreCase(customer.lastName, searchText) ||
      includesIgnoreCase(
        customer.firstName + " " + customer.lastName,
        searchText,
      ) ||
      includesIgnoreCase(customer.phoneNumber, searchText) ||
      includesIgnoreCase(customer.notes, searchText) ||
      includesIgnoreCase(customer.address, searchText) ||
      customer.vehicles.some(
        (v) =>
          includesIgnoreCase(
            v.year + " " + v.make + " " + v.model,
            searchText,
          ) ||
          includesIgnoreCase(v.engine, searchText) ||
          includesIgnoreCase(v.vin, searchText) ||
          includesIgnoreCase(v.notes, searchText),
      )
    )
      return true;
    return false;
  }

  function includesIgnoreCase(source: string | undefined | null, key: string) {
    if (source === null || source === undefined) return false;

    return source.toLocaleLowerCase().includes(key.toLocaleLowerCase());
  }

  function unselectCustomer() {
    setSelectedCustomerId("");
    setSelectedCustomerIndex(-1);
  }

  async function onSaveButtonClick() {
    const path = "/customers/" + localCustomer.phoneNumber;

    setSaveButtonLoading(true);
    const data = await makeRequest<Customer>("PUT", path, localCustomer);
    setSaveButtonLoading(false);

    if (data === null) return null;

    setSelectedCustomerIndex(-1);
    setLocalCustomer(data);
    updateSelectedCustomer(data);
  }

  function handleTabChange(newTabValue: number) {
    unselectCustomer();
    // refresh the list when switching out of "edit" tab
    if (tabValue == 2 && newTabValue != 2) {
      setLocalCustomer(createEmptyCustomer());
      loadAllCustomers();
    } else {
      setResultMessage("");
    }

    setTabValue(newTabValue);
  }

  function handleCustomerClick(index: number) {
    setSelectedCustomerIndex(index);

    if (tabValue == 0) {
      // list tab
      setSelectedCustomerId(filteredCustomers[index].phoneNumber);
      setLocalCustomer(filteredCustomers[index]);
    } else if (tabValue == 1) {
      // open tab
      setSelectedCustomerId(filteredCustomers[index].phoneNumber);
      setLocalCustomer(openCustomers[index]);
    }
  }

  return (
    <Box sx={containerSx}>
      <Typography variant="h5">Customers</Typography>
      <Tabs
        value={tabValue}
        onChange={(_, newValue) => handleTabChange(newValue)}
      >
        <Tab label="All" />
        <Tab label="Open" />
        <Tab label="Edit" />
      </Tabs>
      {tabValue == 2 && (
        <Stack sx={formSx}>
          <TextField
            variant="filled"
            label="Phone Number"
            name="phoneNumber"
            value={localCustomer.phoneNumber}
            onChange={onFormChange}
          />
          <TextField
            variant="filled"
            label="First Name"
            name="firstName"
            value={localCustomer.firstName}
            onChange={onFormChange}
          />
          <TextField
            variant="filled"
            label="Last Name"
            name="lastName"
            value={localCustomer.lastName}
            onChange={onFormChange}
          />

          <TextField
            variant="filled"
            label="Address"
            name="address"
            value={localCustomer.address}
            onChange={onFormChange}
          />
          <TextField
            variant="filled"
            label="Notes"
            name="notes"
            value={localCustomer.notes}
            multiline
            minRows={6}
            maxRows={6}
            onChange={onFormChange}
          />
          <Button
            variant="contained"
            color="warning"
            onClick={onSaveButtonClick}
            disabled={localCustomer.phoneNumber.trim() === ""}
            loading={saveButtonLoading}
          >
            Save
          </Button>
        </Stack>
      )}

      {tabValue == 1 && (
        <Stack sx={listSx}>
          {openCustomers.map((customer, index) => (
            <Box
              key={customer.phoneNumber}
              onClick={() => handleCustomerClick(index)}
            >
              <CustomerCard
                customer={customer}
                selected={index == selectedCustomerIndex}
              />
            </Box>
          ))}
        </Stack>
      )}

      {tabValue == 0 && (
        <>
          <Spinner spin={listLoading} />
          {!listLoading && (
            <Stack sx={listSx}>
              <TextField
                variant="filled"
                label="Search"
                value={searchText}
                onChange={onSearchTextChange}
              />
              {filteredCustomers.map((customer, index) => (
                <Box
                  key={customer.phoneNumber}
                  onClick={() => handleCustomerClick(index)}
                >
                  <CustomerCard
                    customer={customer}
                    selected={index == selectedCustomerIndex}
                  />
                </Box>
              ))}

              {filteredCustomers.length === 0 && (
                <Typography>Empty...</Typography>
              )}
            </Stack>
          )}
        </>
      )}
      <Typography>{resultMessage}</Typography>
    </Box>
  );
}
