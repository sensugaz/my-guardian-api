import { IsEmail, IsNotEmpty } from 'class-validator'

export class CreateCustomerDto {
  @IsNotEmpty()
  @IsEmail()
  email: string

  @IsNotEmpty()
  password: string

  @IsNotEmpty()
  firstName: string

  @IsNotEmpty()
  lastName: string

  @IsNotEmpty()
  phoneCode: string

  @IsNotEmpty()
  phoneNumber: string
}
