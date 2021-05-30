import { IsArray, IsNotEmpty } from 'class-validator'

export class DroppedDto {
  @IsNotEmpty()
  @IsArray()
  bags: string[]
}