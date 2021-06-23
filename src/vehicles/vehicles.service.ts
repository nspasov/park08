import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomUUID } from 'crypto';
import { Parking } from '../parking/parking.model';
import { AddVehicleDto } from './dto/add-vehicle.dto';
import { Vehicle } from './vehicle.entity';
import { DiscountCard, VehicleCategory } from './vehicle.model';
import { VehiclesRepository } from './vehicles.repository';

@Injectable()
export class VehiclesService {
  private parking = Parking.getInstance();
  constructor(
    @InjectRepository(VehiclesRepository)
    private vehiclesRepository: VehiclesRepository,
  ) {}

  public async addVehicle(addVehicleDto: AddVehicleDto) {
    const freeSpots = this.checkFreeSpots();

    const plateNumber = addVehicleDto.plateNumber.toUpperCase();

    const { category, discountCard } = addVehicleDto;

    const vehicle = this.vehiclesRepository.create({
      plateNumber,
      category,
      discountCard,
      enteredAt: new Date(),
      collectedAmmount: 0,
    });

    vehicle.discount = this.getVehicleDiscount(vehicle.discountCard);
    vehicle.slots = this.getVehicleSlots(vehicle.category);

    const vehicleInside = await this.vehiclesRepository.findOne({
      plateNumber: plateNumber,
      leftAt: null,
    });

    if (vehicleInside) {
      throw new InternalServerErrorException(
        `Vehicle is already inside the parking lot!`,
      );
    }

    if (vehicle.slots <= (await freeSpots)) {
      await this.vehiclesRepository.save(vehicle);
    } else {
      throw new InternalServerErrorException('No free spots');
    }

    return vehicle;
  }

  // public addVehicle(vehicleDto: AddVehicleDto) {
  //   // check if vehicle is already in the parking
  //   const freeSpots = this.checkFreeSpots();
  //   const vehicle = new Vehicle(
  //     vehicleDto.plateNumber,
  //     vehicleDto.category,
  //     vehicleDto.discountCard,
  //   );

  //   console.log(vehicle);

  //   if (freeSpots < vehicle.slots) {
  //     throw new InternalServerErrorException(
  //       'Not enough free slots in the parking',
  //     );
  //   } else {
  //     this.vehicles.push(vehicle);
  //     this.parking.removeFreeSlots(vehicle.slots);
  //     console.log(`${this.parking.checkFreeSlots()} free slots left`);
  //   }
  // }

  public async removeVehicle(plateNumber: string) {
    plateNumber = plateNumber.toUpperCase();
    const vehicle = await this.checkForVehicle(plateNumber);
    if (!vehicle) {
      throw new InternalServerErrorException(
        'Vehicle is not inside the parking lot',
      );
    }
    const fee = await this.checkVehicleFee(vehicle.plateNumber);
    console.log(fee);
    vehicle.collectedAmmount = fee;
    vehicle.leftAt = new Date();

    console.log(
      `Vehicle ${vehicle.plateNumber} paid ${vehicle.collectedAmmount}`,
    );

    this.vehiclesRepository.save(vehicle);
    return `Vehicle ${vehicle.plateNumber} left: ${vehicle.collectedAmmount} lv.`;
  }

  public async checkVehicleFee(plateNumber: string): Promise<number> {
    const vehicle = await this.checkForVehicle(plateNumber);
    const spentHours = this.getSpentHours(vehicle);
    let hourLyDayFee: number;
    let hourlyNightFee: number;
    let vehicleFee = 0;

    switch (vehicle.category) {
      case 'A':
        hourLyDayFee = 3;
        hourlyNightFee = 2;
        break;
      case 'B':
        hourLyDayFee = 6;
        hourlyNightFee = 4;
        break;
      case 'C':
        hourLyDayFee = 12;
        hourlyNightFee = 8;
        break;
    }

    for (let i = 0; i < spentHours; i++) {
      if (
        vehicle.enteredAt.getHours() + i >= 8 &&
        vehicle.enteredAt.getHours() + i < 18
      ) {
        vehicleFee += hourLyDayFee;
      } else {
        vehicleFee += hourlyNightFee;
      }
    }

    // (percentToGet / 100) * number;
    switch (vehicle.discount) {
      case 10:
        vehicleFee = (90 / 100) * vehicleFee;
        break;
      case 15:
        vehicleFee = (85 / 100) * vehicleFee;
        break;
      case 20:
        vehicleFee = (80 / 100) * vehicleFee;
        break;
      default:
        break;
    }

    return vehicleFee;
  }

  public async checkFreeSpots(): Promise<number> {
    const occupiedSlots = await this.getOccupiedSlots();
    this.parking.updateFreeSlots(200 - occupiedSlots);
    return this.parking.checkFreeSlots();
  }

  public async getParkedVehicles(): Promise<Vehicle[]> {
    return await this.vehiclesRepository.find({ leftAt: null });
  }

  public async checkForVehicle(plateNumber: string): Promise<Vehicle> {
    plateNumber = plateNumber.toUpperCase();
    const vehicle = await this.vehiclesRepository.findOne({
      plateNumber: plateNumber,
      leftAt: null,
    });

    if (!vehicle) {
      throw new NotFoundException('Vehicle not found');
    }

    return vehicle;
  }

  // public checkForVehicle(plateNumber: string): Vehicle {
  //   const vehicle = this.vehicles.find(
  //     (vehicle) => vehicle.plateNumber === plateNumber && !vehicle.leftAt,
  //   );

  //   if (!vehicle) {
  //     throw new InternalServerErrorException('Vehicle not found');
  //   }

  //   return vehicle;
  // }

  public getSpentHours(vehicle: Vehicle): number {
    //var hoursa = Math.floor(Math.abs(date1 - date2)
    const hours = Math.ceil((Date.now() - Number(vehicle.enteredAt)) / 3600000);
    return hours;
  }

  public getVehicleDiscount(discountCard: DiscountCard): number {
    let discount: number;
    switch (discountCard) {
      case 'NONE':
        discount = 0;
        break;
      case 'SILVER':
        discount = 10;
        break;
      case 'GOLD':
        discount = 15;
        break;
      case 'PLATINUM':
        discount = 20;
        break;
      default:
        throw new InternalServerErrorException('Invalid discount card');
    }

    return discount;
  }

  public getVehicleSlots(category: VehicleCategory) {
    let slots: number;

    switch (category) {
      case 'A':
        slots = 1;
        break;
      case 'B':
        slots = 2;
        break;
      case 'C':
        slots = 4;
        break;
      default:
        throw new InternalServerErrorException('Invalid vehicle category');
    }

    return slots;
  }

  public async getOccupiedSlots(): Promise<number> {
    const parkedVehicles = await this.getParkedVehicles();
    let slots = 0;

    for (const vehicle of parkedVehicles) {
      slots += vehicle.slots;
    }

    return slots;
  }
}
