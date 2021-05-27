import { IsNotEmpty } from 'class-validator'

export class UpdateCustomerDto {
  @IsNotEmpty()
  firstName: string

  @IsNotEmpty()
  lastName: string

  @IsNotEmpty()
  phoneCode: string

  @IsNotEmpty()
  phoneNumber: string
}
