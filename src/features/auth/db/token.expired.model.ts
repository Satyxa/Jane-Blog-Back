import { Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class TokenExpired {
  @PrimaryColumn()
  token: string;
}
