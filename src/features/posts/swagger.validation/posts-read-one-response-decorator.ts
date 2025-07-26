import { ApiOperation, ApiProperty, ApiResponse } from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';
import { CreateCommentResponse } from '../../comments/swagger.validation/comment-create-response-decorator';

export class GetOnePostResponse {
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
    type: [String],
    example: ['https://... .png'],
  })
  imagesUrls: string[];
  @ApiProperty({
    nullable: false,
    type: String,
    example: 'just now / 3 days ago / 6 months ago',
  })
  createdAt: string;
  @ApiProperty({
    nullable: false,
    type: [CreateCommentResponse],
    example: [
      {
        id: '1773b54a-ce33-4cdd-873b-a05097a7567c',
        postId: 'e7602d75-74c3-4487-8846-fcde537d7e62',
        username: 'swafwtwyyxa',
        text: 'riba-balon',
        createdAt: '6 hours ago',
        replies: [
          {
            id: 'c17b4ef4-8169-48e1-b28a-d0a71eafa0e5',
            postId: null,
            username: 'swafwtwyyxa',
            text: 'riba-balodddddddddddddddn',
            createdAt: '2 hours ago',
          },
          {
            id: '1c4bfd0e-c42d-48b0-bf9f-e2acd4c9dfcb',
            postId: null,
            username: 'swafwtwyyxa',
            text: 'riba-balon',
            createdAt: '5 hours ago',
          },
        ],
      },
    ],
  })
  comments: CreateCommentResponse[];
}

export function SwaggerReadOnePostResponseDecorator() {
  return applyDecorators(
    ApiOperation({ summary: 'Read current post by user' }),
    ApiResponse({
      status: 200,
      type: GetOnePostResponse,
    }),
    ApiResponse({ status: 401, description: 'Unauthorized' }),
  );
}
