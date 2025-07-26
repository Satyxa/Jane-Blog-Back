import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum PageType {
  WFF = 'wff',
  PNAA = 'pnaa',
}

@Entity()
export class WFFPNAAPage {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ type: 'varchar' })
  title: string;
  @Column({ type: 'text', default: '', nullable: false })
  text: string;
  @Column({
    type: 'enum',
    enum: PageType,
    default: PageType.WFF,
    unique: true,
  })
  pageType: PageType;
  @Column('simple-array')
  imagesUrls: string[];
}
