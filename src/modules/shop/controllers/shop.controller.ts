import { ApiTags } from '@nestjs/swagger'
import { Controller, Get } from '@nestjs/common'

@ApiTags('shop')
@Controller('/shop')
export class ShopController {
  @Get()
  index() {
    
  }
}