import { ApiOperation, ApiProperty, ApiResponse } from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';

export class LoginResponse {
  @ApiProperty({
    nullable: false,
    type: String,
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImRkNWMwNTM4LWRlYjQtNDAxOC1iZDAwLTk0OGIwY2M0NTI5YiIsImlhdCI6MTc0OTM4Mjc2OCwiZXhwIjoxNzQ5NDE4NzY4fQ.F5rv0kCtjhSrq9MIwayJKOmdmRTOxTwTgVhYxKW68nw',
  })
  accessToken: string;
}

export function SwaggerLoginResponseDecorator() {
  return applyDecorators(
    ApiOperation({ summary: 'Get Access Token' }),
    ApiResponse({
      status: 200,
      type: LoginResponse,
    }),
    ApiResponse({ status: 401, description: 'Unauthorized' }),
  );
}
