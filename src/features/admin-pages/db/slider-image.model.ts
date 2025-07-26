import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class SliderImage {
  @PrimaryGeneratedColumn('uuid')
  id: number;
  @Column({ type: 'text' })
  url: string;
  @CreateDateColumn()
  createdAt: Date;
}
