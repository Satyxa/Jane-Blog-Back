import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Quote {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ type: 'text', default: '', nullable: false })
  text: string;
  @Column({ type: 'varchar' })
  author: string;
}
