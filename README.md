# Shop Management
Web app for managing the custmers of a car service business, their vehicles, the work done on those vehicles, as well as their paymnet.

## Stack Overview
- Backend: ASP.NET Core, deployed as an Azure Web App.
- Data: MySQL Server hosted on Azure. Backend access the database through EF Core.
- Frontend: A React SPA built and served as static HTML files.

## Database Schema
`Customer` has `Vehicles` (one-to-many)   
`Vehicle` has `WorkOrders` (one-to-many)   
`WorkOrder` has `WorkOrderLines` (one-to-many)   

`Customer` has `Vehicle` has `WorkOrder` has `WorkOrderLine`

### customers Table

| Column  | Datatype |
| ------------- | ------------- |
| phone_number (pk)  | varchar(45)  |
| first_name  | varchar(45)  |
| last_name | varchar(45) |
| last_name | varchar(45) |
| address | varchar(45) |
| notes | varchar(1000) |
| last_edit | datetime |



### vehicles Table

| Column  | Datatype |
| ------------- | ------------- |
| vehicle_id (pk) | int |
| customer_phone_number (fk) | varchar(45) |
| year | int |
| make | varchar(45) |
| engine | varchar(45) |
| vin | varchar(45) |
| notes | varchar (1000) |
| last_edit | datetime |

### work_orders Table

| Column  | Datatype |
| ------------- | ------------- |
| work_order_id (pk) | int |
| vehicleOid (fk) | int |
| date | date |
| tax_rate | decimal(5,2) |
| notes | varchar(1000) |

### work_order_lines Table
| Column  | Datatype |
| ------------- | ------------- |
| line_id (pk) | int |
| work_order_id (fk) | int |
| name | varchar(45) |
| type | varchar(45) "labour" or "part" or "payment" |
| cost | decimal(6,2) |

## API

### Customers

#### GET api/customers
Used for displaying all customers in a list.   
Retrieves all customers, their information, information about each of their vehicles, and total amount they owe.   
Does not retrieve information about their vehicle's service history.   
**response 200 OK**
```
[
  {
    "phoneNumber": string,
    "firstName": string,
    "lastName": string,
    "address": string,
    "notes": string,
    "totalOwing": decimal
    "vehicles": [
      {
        "vehicleId": int,
        "customerPhoneNumber": string,
        "year": int,
        "make": string,
        "model": string,
        "engine": string,
        "vin": string,
        "notes": string
      }
    ],
    ...
  },
...
]
```
#### GET api/customer/{phoneNumber}
Used for looking up a specific custoemr by their phone number.   
Retreives information about a specific customer, and information about their vehicles.   
Does not retrieve information about their vehicle's service history.   

**response 200 OK**      
```
{
    "phoneNumber": string,
    "firstName": string,
    "lastName": string,
    "address": string,
    "notes": string,
    "vehicles": [
      {
        "vehicleId": int,
        "customerPhoneNumber": string,
        "year": int,
        "make": string,
        "model": string,
        "engine": string,
        "vin": string,
        "notes": string
      }
    ],
    ...
  },
```

**response 404 NOT FOUND**      
Returned when the customer with that phone number does not exist.


#### PUT api/customer/{phoneNumber}
Used for upserting a customer.
All request fields are optional, as not all information is known about the customer at the time of creation.

***request body**      
```
{
  "firstName"?: string,
  "lastName"?: string,
  "address"?: string,
  "notes"?: string
}
```

**response 201 CREATED**    
Returned when the customer with queried phone number did not exist and was just created.
```
{
  "phoneNumber": string,
  "firstName": string,
  "lastName": string,
  "address": string,
  "notes": string,
  "vehicles": [],
  "totalOwing": decimal
}
```

**response 200 OK**      
Returned when the customer with queried phone number exists and was updated.
```
{
  "phoneNumber": string,
  "firstName": string,
  "lastName": string,
  "address": string,
  "notes": string,
  "vehicles": [],
  "totalOwing": decimal
}
```

### Vehicles

#### POST api/customers/{customerPhoneNumber}/vehicles
Used for adding a vehicle to a customer

**request body**     
All fields are optional, as not all information is always available at the time of creation.
```
{
  "year"?: int,
  "make"?: string,
  "model?": string,
  "engine"?: string,
  "vin"?: string,
  "notes"?: string
}
```

**response 201 CREATED**
```
{
  "vehicleId": int,
  "customerPhoneNumber": string,
  "year": int,
  "make": string,
  "model": string,
  "engine": string,
  "vin": string,
  "notes": string
}
```

#### PUT api/vehicles/{vehicleId}
Used for upserting a vehicle

**request body**     
All fields will be overwritten. If any field is not passed, it will be overwritten with `null`.
```
{
  "year"?: int,
  "make"?: string,
  "model?": string,
  "engine"?: string,
  "vin"?: string,
  "notes"?: string
}
```

**response 200 OK**     
```
{
  "vehicleId": int,
  "customerPhoneNumber": string,
  "year": int,
  "make": string,
  "model": string,
  "engine": string,
  "vin": string,
  "notes": string
}
```

**response 404 NOT FOUND**     
Returned when the vehicle with queried ID is not found. 
```
Vehicle ID {vehicleId} is not found.
```

### WorkOrders***

#### GET api/vehicles/{vehicleId}/work_orders
Used for retreiving all work orders and work order lines for a vehicle with passed ID.
Calculates and returns subtotals, taxes and totals.

**response 200 OK**
```
[
    {
        "workOrderId": int,
        "vehicleId": int,
        "date": string,
        "notes": string,
        "taxFree": boolean,
        "labourTotal": decimal,
        "partsTotal": decimal,
        "paymentsTotal": decimal,
        "subtotal": decimal,
        "taxAmount": decimal,
        "grandTotal": decimal,
        "amountDue": decimal,
        "labour": [
            {
                "name": string,
                "cost": decimal
            },
            ...
        ],
        "parts": [
            {
                "name": string,
                "cost": decimal
            },
            ...
        ],
        "payments": [
            {
              "name": string,
              "cost": decimal
            },
            ...
        ]
    },
    ...
]
```

**response 404 NOT FOUND**     
Returned when the vehicle with queried ID is not found. 
```
Vehicle with ID {vehicleId} does not exist
```

#### POST api/vehicles/{vehicleId}/work_orders
Used for creating a new work order for the vehicle with passed ID.

**request body**
```
{
  "date": string
}
```

**response 200 OK**
```
{
  "workOrderId": int,
  "vehicleId": int,
  "date": string,
  "notes": string,
  "taxFree": boolean,
  "labourTotal": decimal,
  "partsTotal": decimal,
  "paymentsTotal": decimal,
  "subtotal": decimal,
  "taxAmount": decimal,
  "grandTotal": decimal,
  "amountDue": decimal,
  "labour": [],
  "parts": [],
  "payments": []
}
```

**response 404 NOT FOUND**     
Returned when the vehicle with queried ID is not found. 
```
Vehicle with ID {vehicleId} does not exist
```

#### PUT api/work_orders/{work_order_id}
Used for upserting a vehicle

**request body**    
All fields below will be overwritten. If any field is not passed, it will be overwritten with `null`.
```
{
  "date": string,
  "notes": string,
  "taxFree": boolean,

  "labour": [
    {
      "name": string,
      "cost": decimal
    },
    ...
  ],
  "parts": [
    {
      "name": string,
      "cost": decimal
    },
    ...
  ],
  "payments": [
    {
      "name": string,
      "cost": decimal
    },
    ...
  ]
}
```

**response 200 OK**
```
{
  "workOrderId": int,
  "vehicleId": int,
  "date": string,
  "notes": string,
  "taxFree": boolean,
  "labourTotal": decimal,
  "partsTotal": decimal,
  "paymentsTotal": decimal,
  "subtotal": decimal,
  "taxAmount": decimal,
  "grandTotal": decimal,
  "amountDue": decimal,
  "labour": [
    {
      "name": string,
      "cost": decimal
    },
    ...
  ],
  "parts": [
    {
      "name": string,
      "cost": decimal
    },
    ...
  ],
  "payments": [
    {
      "name": string,
      "cost": decimal
    },
    ...
  ]
}
```

**response 404 NOT FOUND**    
Returned when the vehicle with queried ID is not found. 
```
Vehicle with ID {vehicleId} does not exist
```

#### DELETE api/work_orders/{work_order_id}
Used for deleting a work order with passed ID.

**response 204 NO CONTENT**    
Returned when the work worder was successfully deleted.

**response 404 NOT FOUND**    
Returned when the work order with queried ID is not found. 
```
Vehicle with ID {vehicleId} does not exist
```
