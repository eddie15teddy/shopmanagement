export type Customer = {
  phoneNumber: string;
  firstName: string;
  lastName: string;
  address: string;
  notes: string;
  vehicles: Vehicle[];
  totalOwing: number;
};

export function createEmptyCustomer(): Customer {
  return {
    phoneNumber: "",
    firstName: "",
    lastName: "",
    address: "",
    notes: "",
    vehicles: [],
    totalOwing: 0,
  };
}

export type Vehicle = {
  vehicleId?: number;
  year?: number;
  make?: string;
  model?: string;
  engine?: string;
  vin?: string;
  notes?: string;
  customerPhoneNumber?: string;
};

export function createEmptyVehicle(): Vehicle {
  return {
    make: "",
    model: "",
    engine: "",
    vin: "",
    notes: "",
    customerPhoneNumber: "",
  };
}

export type LabourLineItem = {
  name: string;
  cost: number;
};

export type PartLineItem = {
  name: string;
  cost: number;
};

export type PaymentLineItem = {
  name: string;
  cost: number;
};

export type LineItemType = "labour" | "parts" | "payment";

export type WorkOrder = {
  vehicleId: number;
  workOrderId: number;
  date: string;

  labour: LabourLineItem[];
  parts: PartLineItem[];
  payments: PaymentLineItem[];
  notes: string;
  taxFree: boolean;

  labourTotal: number;
  partsTotal: number;
  subtotal: number;
  taxAmount: number;
  grandTotal: number;
  paymentsTotal: number;
  amountDue: number;
};

export type UpdateWorkOrderRequest = {
  workOrderId: number;
  date: string;
  notes: string;
  taxFree: boolean;

  labour: LabourLineItem[];
  parts: PartLineItem[];
  payments: PaymentLineItem[];
};

export function createUpdateWorkOrderRequest(
  workOrder: WorkOrder,
): UpdateWorkOrderRequest {
  return {
    workOrderId: workOrder.workOrderId,
    date: workOrder.date,
    notes: workOrder.notes,
    taxFree: workOrder.taxFree,

    labour: workOrder.labour,
    parts: workOrder.parts,
    payments: workOrder.payments,
  };
}

export type NewWorkOrderRequest = {
  date: string
}