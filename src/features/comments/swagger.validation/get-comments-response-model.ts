import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class GetCommentsResponseModel {
  @IsString()
  @MinLength(1, {})
  @ApiProperty({
    example: 'some title',
    nullable: false,
    type: String,
    required: true,
  })
  username: string;
  @IsString()
  @MinLength(1, {})
  @ApiProperty({
    required: true,
    type: String,
    example: 'some story',
    nullable: false,
  })
  text: string;
}
