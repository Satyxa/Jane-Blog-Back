import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateQuoteRequest {
  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'some title', type: String })
  author: string;
  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'some story', type: String })
  text: string;
}
