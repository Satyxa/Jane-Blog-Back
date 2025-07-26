import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class SendRecoveryCodeRequest {
  @IsEmail()
  @ApiProperty({
    description: 'email: email for recovering password',
    example: 'example@gmail.com',
  })
  email: string;
}
