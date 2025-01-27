import { IsString, IsArray } from 'class-validator';

export class GenerateAdDto {
  @IsString()
  productName: string;

  @IsString()
  targetAudience: string;

  @IsArray()
  @IsString({ each: true }) // Cada item do array deve ser uma string
  keyFeatures: string[];
}
