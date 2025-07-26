import { ApiOperation, ApiProperty, ApiResponse } from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';

export class GetManyPostsResponse {
  @ApiProperty({
    nullable: false,
    type: String,
    example: 'b26e6ec3-b512-44bb-98b1-b96df5e545b0',
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
    example: 'https://... .png',
  })
  imageUrl: string;
  @ApiProperty({
    nullable: false,
    type: String,
    example: 'just now / 3 days ago / 6 months ago',
  })
  createdAt: string;
}

export function SwaggerReadManyPostResponseDecorator() {
  return applyDecorators(
    ApiOperation({ summary: 'Read many posts by users' }),
    ApiResponse({
      status: 200,
      type: [GetManyPostsResponse],
    }),
    ApiResponse({ status: 401, description: 'Unauthorized' }),
  );
}
