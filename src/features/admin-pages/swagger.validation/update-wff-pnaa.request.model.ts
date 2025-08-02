import { ApiProperty } from '@nestjs/swagger';
import { PageType } from '../db/wff-pnaa-pages.model';
import { IsOptional } from 'class-validator';

export class UpdateWFFPNAARequest {
  @IsOptional()
  @ApiProperty({ example: 'some title', type: String })
  title: string;
  @IsOptional()
  @ApiProperty({ example: 'some story', type: String })
  text: string;

  @ApiProperty({ example: 'wff', enum: PageType })
  pageType: PageType;
  @IsOptional()
  @ApiProperty({
    type: 'array',
    items: {
      type: 'string',
      format: 'binary',
    },
    required: false,
  })
  images: Express.Multer.File[];
}
