import { DiscountCard, VehicleCategory } from '../vehicle.model';

export class AddVehicleDto {
  plateNumber: string;
  category: VehicleCategory;
  discountCard: DiscountCard;
}
