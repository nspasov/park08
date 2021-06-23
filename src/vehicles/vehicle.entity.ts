import { InternalServerErrorException } from '@nestjs/common';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { DiscountCard, VehicleCategory } from './vehicle.model';

@Entity()
export class Vehicle {
  // id: string;
  // plateNumber: string;
  // slots: number;
  // category: VehicleCategory;
  // discountCard: DiscountCard;
  // discount: number;
  // moneyOwed: number;
  // enteredAt: Date;
  // leftAt?: Date;
  // collectedAmmount?: number;

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  plateNumber: string;

  @Column()
  slots: number;

  @Column()
  category: VehicleCategory;

  @Column()
  discountCard: DiscountCard;

  @Column()
  discount: number;

  //   @Column()
  //   moneyOwed: number;

  @Column()
  enteredAt: Date;

  @Column({ nullable: true })
  leftAt?: Date;

  @Column({ type: 'float' })
  collectedAmmount: number;

  moneyOwed: number;

  //   constructor(
  //     plateNumber: string,
  //     category: VehicleCategory,
  //     discountCard: DiscountCard,
  //   ) {
  //     this.plateNumber = plateNumber;
  //     this.category = category;

  //     switch (category) {
  //       case 'A':
  //         this.slots = 1;
  //         break;
  //       case 'B':
  //         this.slots = 2;
  //         break;
  //       case 'C':
  //         this.slots = 3;
  //         break;
  //       default:
  //         throw new InternalServerErrorException('Invalid vehicle category');
  //     }

  //     this.discountCard = discountCard;
  //     this.getDiscount(this.discountCard);
  //     console.log(`${this.discountCard} : ${this.discount}% discount`);
  //     this.moneyOwed = 0;
  //     this.enteredAt = new Date(); // creates Date object with current date & time
  //   }

  //   public getDiscount(discountCard: DiscountCard) {
  //     switch (discountCard) {
  //       case 'NONE':
  //         this.discount = 0;
  //         break;
  //       case 'SILVER':
  //         this.discount = 10;
  //         break;
  //       case 'GOLD':
  //         this.discount = 15;
  //         break;
  //       case 'PLATINUM':
  //         this.discount = 20;
  //         break;
  //       default:
  //         throw new InternalServerErrorException('Invalid discount card');
  //     }
  //   }

  //   public deregister() {
  //     this.leftAt = new Date();
  //   }
}
