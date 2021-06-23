import { VehiclesService } from 'src/vehicles/vehicles.service';

export class Parking {
  private totalSlots: number;
  private freeSlots: number;
  private static instance: Parking;

  private constructor() {
    this.totalSlots = 200;
    this.freeSlots = 200;
  }

  public static getInstance(): Parking {
    if (!Parking.instance) {
      Parking.instance = new Parking();
    }

    return Parking.instance;
  }

  public removeFreeSlots(slots: number): number {
    this.freeSlots -= slots;
    return this.freeSlots;
  }

  public addFreeSlots(slots: number): number {
    this.freeSlots += slots;
    return this.freeSlots;
  }

  public checkFreeSlots(): number {
    return this.freeSlots;
  }

  public updateFreeSlots(updatedFreeSlots: number): void {
    this.freeSlots = updatedFreeSlots;
  }
}
