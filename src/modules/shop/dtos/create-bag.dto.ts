import { IsNotEmpty } from 'class-validator'

export class CreateBagDto {
  @IsNotEmpty()
  number: string
}
