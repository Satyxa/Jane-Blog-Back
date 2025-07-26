import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Posts, ManyPostsViewModel } from '../../posts/db/posts.model';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ type: 'varchar', unique: true })
  email: string;
  @Column({ type: 'varchar' })
  passwordHash: string;
  @Column({ type: 'varchar', nullable: true })
  recoveryCode: string | null;
  @OneToMany(() => Posts, (p) => p.id, { onDelete: 'CASCADE' })
  @JoinColumn()
  post: Posts[];

  static createViewModel(user: User) {
    return {
      id: user.id,
      email: user.email,
      posts: [],
    };
  }
}

export class UserViewModel {
  @ApiProperty({
    nullable: false,
    type: String,
    example: 'satyxa1919@gmail.com',
  })
  email: string;
  @ApiProperty({
    nullable: false,
    type: String,
    example: 'c72e3b83-7bcf-413c-919f-c82dfd66de88',
  })
  id: string;
  @ApiProperty({ example: [ManyPostsViewModel] })
  posts: ManyPostsViewModel[];
}
