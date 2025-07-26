import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateQuoteRequest {
  @IsString()
  @ApiProperty({ example: 'some title', type: String })
  author: string;

  @IsString()
  @ApiProperty({ example: 'some story', type: String })
  text: string;
}
