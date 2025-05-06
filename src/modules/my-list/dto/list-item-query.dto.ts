import { Type } from 'class-transformer';
import { IsOptional, IsNumber, Min } from 'class-validator';

export class ListItemQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit = 10;
}
