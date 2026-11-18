import { create } from "zustand";
import type { Customer, Vehicle, WorkOrder } from "./types";

interface store {
  selectedCustomerId: string;
  allCustomers: Customer[];
  selectedVehicleIndex: number;
  workOrders: WorkOrder[] | null;
  workOrdersLoading: boolean;

  getSelectedCustomer: () => Customer | null;
  updateSelectedCustomer: (updatedCustomer: Customer) => void;
  setSelectedCustomerId: (id: string) => void;
  setAllCustomers: (allCustomers: Customer[]) => void;
  setWorkOrders: (workOrders: WorkOrder[]) => void;
  setSelectedVehicleIndex: (selectedVehicleIndex: number) => void;
  setWorkOrdersLoading: (workOrdersLoading: boolean) => void;

  addNewVehicleToSelectedCustomer: (newVehicle: Vehicle) => void;
  updateVehicleOfSelectedCustomer: (updatedVehicle: Vehicle) => void;

  updateWorkOrder: (updatedWorkOrder: WorkOrder) => void;
  deleteWorkOrder: (workOrderId: number) => void;
  createWorkOrder: (newWorkOrder: WorkOrder) => void;
}

export const useStore = create<store>((set, get) => ({
  selectedCustomerId: "",
  allCustomers: [],
  workOrders: [],
  selectedVehicleIndex: -1,
  workOrdersLoading: false,

  getSelectedCustomer: () => {
    const customer = get().allCustomers.find(
      (customer) => customer.phoneNumber === get().selectedCustomerId,
    );
    return customer ?? null;
  },
  updateSelectedCustomer: (updatedCustomer: Customer) => {
    set((state) => ({
      allCustomers: state.allCustomers.map((customer) =>
        customer.phoneNumber === state.selectedCustomerId
          ? updatedCustomer
          : customer,
      ),
    }));
  },
  setSelectedCustomerId: (id: string) => {
    // Changing selected customer also resets selectedVehicleIndex and workOrders 
    // because they are both tied to the selected customer 
    set((state) =>
      state.selectedCustomerId === id
        ? state
        : {
            selectedCustomerId: id,
            workOrders: null,
            selectedVehicleIndex: -1,
          },
    );
  },
  setAllCustomers: (allCustomers: Customer[]) => set({ allCustomers }),
  setWorkOrders: (workOrders: WorkOrder[] | null) => {
    // Setting workOrders to an array turns off loading state
    // because the work orders are no longer loading if they are being set
    set((state) => ({
      workOrders,
      workOrdersLoading: workOrders === null ? state.workOrdersLoading : false,
    }));
  },
  setSelectedVehicleIndex: (selectedVehicleIndex: number) => {
    // Changing the selected vehicle index sets the workOrders to null
    // because the work orders are always for the selected vehicle
    set((state) =>
      state.selectedVehicleIndex === selectedVehicleIndex
        ? state
        : { selectedVehicleIndex, workOrders: null },
    );
  },

  addNewVehicleToSelectedCustomer: (newVehicle: Vehicle) => {
    set((state) => ({
      allCustomers: state.allCustomers.map((customer) =>
        customer.phoneNumber === state.selectedCustomerId
          ? {
              ...customer,
              vehicles: [...customer.vehicles, newVehicle],
            }
          : customer,
      ),
    }));
  },

  updateVehicleOfSelectedCustomer: (updatedVehicle: Vehicle) => {
    set((state) => ({
      allCustomers: state.allCustomers.map((customer) =>
        customer.phoneNumber === state.selectedCustomerId
          ? {
              ...customer,
              vehicles: customer.vehicles.map((vehicle) =>
                vehicle.vehicleId === updatedVehicle.vehicleId
                  ? updatedVehicle
                  : vehicle,
              ),
            }
          : customer,
      ),
    }));
  },

  updateWorkOrder: (updatedWorkOrder: WorkOrder) => {
    set((state) => {
      const workOrders = state.workOrders;
      if (!workOrders) return state;

      const updatedWorkOrders = workOrders.map((order) =>
        order.workOrderId === updatedWorkOrder.workOrderId
          ? updatedWorkOrder
          : order,
      );

      return {
        workOrders: updatedWorkOrders,
      };
    });
  },

  deleteWorkOrder: (workOrderId: number) => {
    set((state) => {
      const workOrders = state.workOrders;
      if (!workOrders) return state;

      const updatedWorkOrders = workOrders.filter(
        (order) => order.workOrderId !== workOrderId,
      );
      return {
        workOrders: updatedWorkOrders,
      };
    });
  },

  createWorkOrder: (newWorkOrder: WorkOrder) => {
    set((state) => ({
      workOrders: [newWorkOrder, ...(state.workOrders ?? [])],
    }));
  },

  setWorkOrdersLoading: (workOrdersLoading: boolean) =>
    set({ workOrdersLoading }),
}));
