import { ApiOperation, ApiProperty, ApiResponse } from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';

export class CreateCommentResponse {
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
  postId: string;
  @ApiProperty({
    nullable: false,
    type: String,
    example: 'riba-balon',
  })
  username: string;
  @ApiProperty({
    nullable: false,
    type: String,
    example: 'some text',
  })
  text: string;
  @ApiProperty({
    nullable: false,
    type: String,
    example: 'just now / 3 days ago / 6 months ago',
  })
  createdAt: string;
}

export function SwaggerCreateCommentResponseDecorator() {
  return applyDecorators(
    ApiOperation({ summary: 'Create comment by unauthorized user' }),
    ApiResponse({
      status: 200,
      type: CreateCommentResponse,
    }),
  );
}
