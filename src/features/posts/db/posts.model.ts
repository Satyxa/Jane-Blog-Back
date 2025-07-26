import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../auth/db/users.model';
import { Comment, CommentViewModel } from '../../comments/db/comments.model';
import { ApiProperty } from '@nestjs/swagger';
import { getRelativeTime } from '../../utils/createdAt-formatting';

@Entity()
export class Posts {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ type: 'varchar' })
  title: string;
  @Column({ type: 'varchar' })
  text: string;
  @CreateDateColumn()
  createdAt: Date;
  @Column({ type: 'varchar', nullable: true })
  imageUrl: string | null;
  @Column('simple-array', { default: '', nullable: false })
  imagesUrls: string[];
  @ManyToOne(() => User, (u) => u.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
  @OneToMany(() => Comment, (c) => c.post, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'comments_ids' })
  comments: Comment[];
}

export class OnePostViewModel {
  @ApiProperty({
    nullable: false,
    type: String,
    example: '9bc6b7e3-f72f-42f6-8786-6352b4f8c213',
  })
  id: string;
  @ApiProperty({
    nullable: false,
    type: String,
    example: 'some title',
  })
  title: string;
  @ApiProperty({
    nullable: false,
    type: String,
    example: 'some story',
  })
  text: string;
  @ApiProperty({
    nullable: false,
    type: String,
    example: 'url',
  })
  imageUrl: string | null;
  @ApiProperty({
    nullable: false,
    type: String,
    example: '2e71a5f0-3d3b-42b7-ab38-d71381083a4f',
  })
  userId: string;
  @ApiProperty({
    nullable: false,
    type: String,
    example: '6 months ago',
  })
  createdAt: string;
  @ApiProperty({
    nullable: false,
    example: [CommentViewModel],
  })
  comments: CommentViewModel[];
}

export class ManyPostsViewModel {
  @ApiProperty({
    nullable: false,
    type: String,
    example: '9bc6b7e3-f72f-42f6-8786-6352b4f8c213',
  })
  id: string;
  @ApiProperty({
    nullable: false,
    type: String,
    example: 'some title',
  })
  title: string;
  @ApiProperty({
    nullable: false,
    type: String,
    example: 'url',
  })
  imageUrl: string | null;
  @ApiProperty({
    nullable: false,
    type: String,
    example: '6 months ago',
  })
  createdAt: string;
}
