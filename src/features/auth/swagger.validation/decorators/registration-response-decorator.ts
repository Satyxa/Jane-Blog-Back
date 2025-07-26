import { ApiOperation, ApiProperty, ApiResponse } from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';

export class RegistrationResponse {
  @ApiProperty({
    nullable: false,
    type: String,
    example: 'satyxa1919@gmail.com',
  })
  email: string;
  @ApiProperty({
    nullable: false,
    type: String,
    example: '7ad24d3a-a05b-40df-9ddc-42a53934d80f',
  })
  id: string;
}

export function SwaggerRegistrationResponseDecorator() {
  return applyDecorators(
    ApiOperation({ summary: 'Get Created User' }),
    ApiResponse({
      status: 200,
      type: RegistrationResponse,
    }),
  );
}
