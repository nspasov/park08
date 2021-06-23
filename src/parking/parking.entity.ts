import { Column, PrimaryGeneratedColumn } from 'typeorm';

export class ParkingEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  totalSlots: number;

  @Column()
  freeSlots: number;
}
