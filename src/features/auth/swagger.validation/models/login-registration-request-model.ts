import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class LoginRegistrationRequest {
  @IsEmail()
  @Transform(
    ({ value }: { value: string }) => value?.trim().replace(/\s+/g, ' ') || '',
  )
  @ApiProperty({
    example: 'email@email.com',
    nullable: false,
    type: String,
    required: true,
  })
  email: string;
  @IsString()
  @MinLength(1)
  @ApiProperty({
    required: true,
    type: String,
    example: 'banana!033',
    nullable: false,
  })
  password: string;
}
