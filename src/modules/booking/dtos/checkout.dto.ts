import { IsNotEmpty, IsOptional } from 'class-validator'

export class CheckoutDto {
  @IsNotEmpty()
  shopId: string

  @IsNotEmpty()
  scheduleId: string

  @IsNotEmpty()
  priceId: string

  @IsOptional()
  voucherCode?: string
}
