import { Body, Controller, Get, Param, Post, Patch } from '@nestjs/common';
import { AddVehicleDto } from './dto/add-vehicle.dto';
import { Vehicle } from './vehicle.entity';
//import { Parking } from 'src/parking/parking.model';
import { VehiclesService } from './vehicles.service';

@Controller('vehicles')
export class VehiclesController {
  private vehiclesService: VehiclesService;
  //private parking: Parking;

  constructor(vehiclesService: VehiclesService) {
    this.vehiclesService = vehiclesService;
  }

  @Get('/freeSpots')
  public checkFreeSpots() {
    return this.vehiclesService.checkFreeSpots();
  }

  @Post('/new')
  public addVehicle(@Body() addVehicleDto: AddVehicleDto) {
    return this.vehiclesService.addVehicle(addVehicleDto);
  }

  @Patch('/remove/:plateNumber')
  public removeVehicle(@Param('plateNumber') plateNumber: string) {
    return this.vehiclesService.removeVehicle(plateNumber);
  }

  @Get('/check/:plateNumber')
  public CheckVehicleFee(
    @Param('plateNumber') plateNumber: string,
  ): Promise<number> {
    return this.vehiclesService.checkVehicleFee(plateNumber);
  }

  @Get()
  public getParkedVehicles() {
    return this.vehiclesService.getParkedVehicles();
  }
}
