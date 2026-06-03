using QuestPDF.Fluent;
using QuestPDF.Infrastructure;
using ShopManagement.DTOs;

namespace PDF_Reader;

public class InvoiceDocument : IDocument
{
    private readonly InvoiceDataDto _data;

    public InvoiceDocument(InvoiceDataDto data)
    {
        _data = data;
        QuestPDF.Settings.License = LicenseType.Community;
    }

    public DocumentMetadata GetMetadata() => DocumentMetadata.Default;

    public void Compose(IDocumentContainer container)
    {
        container.Page(page =>
        {
            page.Margin(30);

            page.Header().Element(ComposeHeader);
            page.Content().Element(ComposeContent);
            page.Footer().Element(ComposeFooter);
        });
    }

    private void ComposeHeader(IContainer container)
    {
        container.Row(row =>
        {
            row.RelativeItem().Column(col =>
            {
                col.Item().Text(_data.Shop?.Name).Bold().FontSize(18);
                col.Item().Text(_data.Shop?.Address);
                col.Item().Text(_data.Shop?.PhoneNumber);
                col.Item().Text(_data.Shop?.Email);
            });

            row.ConstantItem(200).AlignRight().Column(col =>
            {
                col.Item().Text(_data.Estimate ? "ESTIMATE" : "INVOICE").Bold().FontSize(20);
                if (_data.Estimate == false)
                    col.Item().Text($"InvoiceNumber: {_data.WorkOrderDto.WorkOrderId}");

                // Get current date in Winnipeg (as opposed to server location)
                var timeZoneId = OperatingSystem.IsWindows()
                    ? "Central Standard Time"
                    : "America/Winnipeg"; 
                var wpgDateTime = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, TimeZoneInfo.FindSystemTimeZoneById(timeZoneId));
                col.Item().Text($"Date: {wpgDateTime:yyyy-MM-dd}");
            });
        });
    }

    private void ComposeContent(IContainer container)
    {
        container.PaddingVertical(10).Column(col =>
        {
            col.Spacing(15);

            // Customer + Vehicle side-by-side
            col.Item().Row(row =>
            {
                row.Spacing(10);

                row.RelativeItem().Element(ComposeCustomer);
                row.RelativeItem().Element(ComposeVehicle);
            });

            // Labour table
            if (_data.WorkOrderDto.Labour.Count() > 0)
            {
                col.Item().Element(c => ComposeTable(c, $"Labour  - ${_data.WorkOrderDto.LabourTotal}", _data.WorkOrderDto.Labour));
            }


            // Parts table
            if (_data.WorkOrderDto.Parts.Count() > 0)
            {
                col.Item().Element(c => ComposeTable(c, $"Parts - ${_data.WorkOrderDto.PartsTotal}", _data.WorkOrderDto.Parts));
            }
        });
    }

    private void ComposeFooter(IContainer container)
    {
        container.PaddingTop(10).Column(col =>
    {
        col.Item().LineHorizontal(1);

        col.Item().Row(row =>
        {
            // Left side (optional message)
            row.RelativeItem().AlignLeft().Text($"Notes:\n{_data.Notes}").FontSize(10);
            row.RelativeItem().AlignLeft().Text("Thank you for your business").FontSize(10);

            // Right side (totals)
            row.ConstantItem(250).AlignRight().Element(ComposeTotals);
        });
    });
    }

    private void ComposeCustomer(IContainer container)
    {
        container.Border(1).Padding(10).Column(col =>
        {
            col.Item().Text("Bill To").Bold();

            var customer = _data.Customer;

            col.Item().Text($"{customer?.FirstName} {customer?.LastName}");
            col.Item().Text(customer?.Address);
            col.Item().Text(FormatPhoneNumber(customer?.PhoneNumber));
        });
    }

    private static string FormatPhoneNumber(string? phoneNumber)
    {

        if(phoneNumber != null && phoneNumber.Length == 10)
        {
            string areaCode = "(" + phoneNumber[0..3] + ")";
            string number = phoneNumber[3..6] + "-" + phoneNumber[6..10];

            return  areaCode + " " + number;
        }

        return phoneNumber ?? "";
    }

    private void ComposeTable(IContainer container, string title, WorkOrderLineDto[] items)
    {
        container.Column(col =>
        {
            col.Item().Text(title).Bold().FontSize(14);

            col.Item().Table(table =>
            {
                table.ColumnsDefinition(columns =>
                {
                    columns.RelativeColumn();
                    columns.ConstantColumn(100);
                });

                table.Header(header =>
                {
                    header.Cell().Text("Item").Bold();
                    header.Cell().AlignRight().Text("Cost").Bold();
                });

                foreach (var item in items)
                {
                    table.Cell().BorderBottom(1).Text(item.Name);
                    table.Cell().BorderBottom(1).AlignRight().Text($"{item.Cost:C}");
                }
            });
        });
    }

    private void ComposeVehicle(IContainer container)
    {
        var vehicle = _data.Vehicle;

        container.Border(1).Padding(10).Column(col =>
        {
            col.Item().Text("Vehicle").Bold();

            if (vehicle == null)
                return;

            col.Item().Text($"{vehicle.Year} {vehicle.Make} {vehicle.Model}");
            col.Item().Text($"Engine: {vehicle.Engine}");
            col.Item().Text($"VIN: {vehicle.Vin}");
        });
    }

    private void ComposeTotals(IContainer container)
    {
        container.AlignRight().Width(250).Table(table =>
        {
            table.ColumnsDefinition(columns =>
            {
                columns.RelativeColumn();
                columns.ConstantColumn(100);
            });

            void Row(string label, decimal value, bool bold = false)
            {
                table.Cell().Text(label).SemiBold();
                table.Cell().AlignRight().Text($"{value:C}").SemiBold();
            }

            Row("Subtotal", _data.WorkOrderDto.Subtotal);
            Row("Tax", _data.WorkOrderDto.TaxAmount);

            table.Cell().Text("Grand Total").Bold();
            table.Cell().AlignRight().Text($"{_data.WorkOrderDto.GrandTotal:C}").Bold();

            if (_data.Estimate == false)
            {
                table.Cell().Text("Paid").Bold();
                table.Cell().AlignRight().Text($"{_data.WorkOrderDto.PaymentsTotal:C}").Bold();

                table.Cell().Text("Amount Due").Bold().FontSize(12);
                table.Cell().AlignRight().Text($"{_data.WorkOrderDto.AmountDue:C}").Bold().FontSize(12);
            }
        });
    }
}