import { ApiTags } from '@nestjs/swagger'
import { Controller, Get } from '@nestjs/common'

@ApiTags('shops')
@Controller('/shops')
export class ShopController {
  @Get()
  index() {

  }
}