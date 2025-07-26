import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class NewPasswordRequest {
  @IsEmail()
  @ApiProperty({ example: 'satyxa1919@gmail.com' })
  email: string;
  @IsString()
  @ApiProperty({ example: 'riba-balon' })
  newPassword: string;
  @IsString()
  @ApiProperty({
    description: 'recovery code from email',
    example: '111111',
  })
  recoveryCode: string;
}
