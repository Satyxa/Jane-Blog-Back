import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';
import { CreateCommentResponse } from './comment-create-response-decorator';

export function SwaggerGetCommentsForPostResponseDecorator() {
  return applyDecorators(
    ApiOperation({ summary: 'Get comments for current post' }),
    ApiResponse({
      status: 200,
      type: [CreateCommentResponse],
    }),
  );
}
