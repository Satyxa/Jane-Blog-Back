import {
  ApiHeader,
  ApiOperation,
  ApiProperty,
  ApiResponse,
} from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';
import { CommentViewModel } from '../../comments/db/comments.model';

export class CreatePostResponse {
  @ApiProperty({
    nullable: false,
    type: String,
    example: 'b26e6ec3-b512-44bb-98b1-b96df5e545b0',
  })
  id: string;
  @ApiProperty({
    nullable: false,
    type: String,
    example: '7ad24d3a-a05b-40df-9ddc-42a53934d80f',
  })
  userId: string;
  @ApiProperty({
    nullable: false,
    type: String,
    example: 'some title',
  })
  title: string;
  @ApiProperty({
    nullable: false,
    type: String,
    example: 'some text',
  })
  text: string;
  @ApiProperty({
    nullable: false,
    type: String,
    example: 'https://... .png',
  })
  imageUrl: string;
  @ApiProperty({
    nullable: false,
    type: String,
    example: 'just now / 3 days ago / 6 months ago',
  })
  createdAt: string;
  @ApiProperty({
    nullable: false,
    type: [CommentViewModel],
    example: [],
  })
  comments: CommentViewModel[];
}

export function SwaggerCreatePostResponseDecorator() {
  return applyDecorators(
    ApiOperation({ summary: 'Create post by admin' }),
    ApiHeader({
      name: 'Authorization',
      description: 'accessToken',
      required: true,
    }),
    ApiResponse({
      status: 200,
      type: CreatePostResponse,
    }),
    ApiResponse({ status: 401, description: 'Unauthorized' }),
  );
}
