import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreatePostRequest {
  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'some title',
    nullable: false,
    type: String,
    required: true,
  })
  title: string;
  @IsOptional()
  @IsString()
  @ApiProperty({
    required: true,
    type: String,
    example: 'some story',
    nullable: false,
  })
  text: string;
  @IsOptional()
  @ApiProperty({
    description: 'File max size for image - 20MB',
    nullable: false,
    type: 'string',
    format: 'binary',
    required: false,
  })
  file: Express.Multer.File[];
  @IsOptional()
  @ApiProperty({
    description: 'File max size for image - 20MB',
    nullable: false,
    type: 'string',
    format: 'binary',
    required: false,
  })
  images: Express.Multer.File[];
}
