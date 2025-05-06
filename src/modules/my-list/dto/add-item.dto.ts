import { IsString, IsNotEmpty, IsEnum } from 'class-validator';
import { ContentType } from '../enums';
import { Type } from 'class-transformer';

export class AddItemDto {
  @IsString()
  @IsNotEmpty()
  @Type(() => String)
  contentId: string;

  @IsNotEmpty()
  @IsString()
  @IsEnum(ContentType)
  contentType: ContentType;
}
