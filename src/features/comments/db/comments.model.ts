import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Posts } from '../../posts/db/posts.model';
import { ApiProperty } from '@nestjs/swagger';
import { getRelativeTime } from '../../utils/createdAt-formatting';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ type: 'varchar' })
  username: string;
  @Column({ type: 'text', default: '', nullable: false })
  text: string;
  @ManyToOne(() => Posts, (p) => p.id, { onDelete: 'CASCADE' })
  post: Posts;
  @CreateDateColumn()
  createdAt: Date;
  @ManyToOne(() => Comment, (comment) => comment.replies, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'replyToId' })
  parentComment: Comment;

  @OneToMany(() => Comment, (comment) => comment.parentComment)
  replies: Comment[];

  replyToId: string | null;
  static createViewModel(comment: Comment): CommentViewModel {
    return {
      id: comment.id,
      postId: comment.post ? comment.post.id : null,
      username: comment.username,
      text: comment.text,
      createdAt: getRelativeTime(comment.createdAt),
    };
  }
}

export class CommentViewModel {
  @ApiProperty({
    nullable: false,
    type: String,
    example: '9bc6b7e3-f72f-42f6-8786-6352b4f8c213',
  })
  id: string;
  @ApiProperty({
    nullable: false,
    type: String,
    example: 'satyxa',
  })
  username: string;
  @ApiProperty({
    nullable: false,
    type: String,
    example: 'riba-balon',
  })
  text: string;
  @ApiProperty({
    nullable: false,
    type: String,
    example: '2e71a5f0-3d3b-42b7-ab38-d71381083a4f',
  })
  postId: string | null;
  @ApiProperty({
    nullable: false,
    type: String,
    example: '6 months ago',
  })
  createdAt: string;
  @ApiProperty({
    required: false,
    type: String,
    example: 'id of comment for reply',
    nullable: true,
    default: null,
  })
  replies?: CommentViewModel[];
}
