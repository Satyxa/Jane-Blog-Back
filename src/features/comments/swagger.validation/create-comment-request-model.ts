import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateCommentRequest {
  @IsString()
  @Transform(
    ({ value }: { value: string }) => value?.trim().replace(/\s+/g, ' ') || '',
  )
  @MinLength(1, {})
  @MaxLength(100, {})
  @ApiProperty({
    example: 'some title',
    nullable: false,
    type: String,
    required: true,
  })
  username: string;
  @IsString()
  @MinLength(1, {})
  @MaxLength(2000, {})
  @ApiProperty({
    required: true,
    type: String,
    example: 'some story',
    nullable: false,
  })
  text: string;
  @IsOptional()
  @IsString()
  @ApiProperty({
    required: false,
    type: String,
    example: 'id of comment for reply',
    nullable: true,
    default: null,
  })
  replyToId: string | null;
}
