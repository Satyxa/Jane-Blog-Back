import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class QueryPaginationParams {
  @IsOptional()
  @IsString()
  @ApiProperty({
    example: '1',
    nullable: false,
    type: String,
    required: false,
  })
  pageNumber: string = '1';
  @IsOptional()
  @IsString()
  @ApiProperty({
    example: '10',
    nullable: false,
    type: String,
    required: false,
  })
  pageSize: string = '10';
}
