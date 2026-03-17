namespace ShopManagement.Controllers;

using Microsoft.AspNetCore.Mvc;
using ShopManagement.DTOs;
using ShopManagement.Services;

[ApiController]
public class WorkOrdersController : ControllerBase
{
    private readonly VehiclesService _vehiclesService;
    private readonly WorkOrdersService _workOrdersService;

    public WorkOrdersController(VehiclesService vehiclesService, WorkOrdersService workOrdersService)
    {
        _vehiclesService = vehiclesService;
        _workOrdersService = workOrdersService;
    }

    [HttpGet("api/vehicles/{vehicleId}/work_orders")]
    public async Task<IActionResult> Get(int vehicleId)
    {
        var workOrderDtos = await _workOrdersService.GetWorkOrdersAsync(vehicleId);
        if (workOrderDtos == null)
            return NotFound($"Vehicle with ID {vehicleId} does not exist");
        else
            return Ok(workOrderDtos);
    }

    [HttpPost("api/vehicles/{vehicleId}/work_orders")]
    public async Task<IActionResult> Post(int vehicleId, CreateWorkOrderDto dto)
    {
        var responseDto = await _workOrdersService.CreateWorkOrderAsync(vehicleId, dto);

        if (responseDto == null)
            return NotFound($"Vehicle with ID {vehicleId} does not exist");
        else 
            return Ok(responseDto);
    }

    [HttpDelete("api/work_orders/{work_order_id}")]
    public async Task<IActionResult> Delete(int work_order_id)
    {
        var result = await _workOrdersService.DeleteWorkOrder(work_order_id);
        if (result)
            return NoContent();
        else
            return NotFound($"Work order with  ID {work_order_id} does not exist");
    }

    [HttpPut("api/work_orders/{work_order_id}")]
    public async Task<IActionResult> Put(int work_order_id, UpdateWorkOrderDto dto)
    {
        var result = await _workOrdersService.UpdateWorkOrder(work_order_id, dto);
        
        if (result == null)
            return NotFound($"Work order with  ID {work_order_id} does not exist");
        else
            return Ok(result);
    }
}