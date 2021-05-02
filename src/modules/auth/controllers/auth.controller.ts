import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { CommandBus, QueryBus } from '@nestjs/cqrs'
import { RegisterDto } from '../dtos'
import { UserModel } from '@my-guardian-api/database'
import { RegisterCommand } from '../commands/command'

@ApiTags('/auth')
@Controller('/auth')
export class AuthController {
  constructor(private readonly commandBus: CommandBus,
              private readonly queryBus: QueryBus) {
  }

  @Post('/register')
  @HttpCode(HttpStatus.OK)
  register(@Body() body: RegisterDto): Promise<UserModel> {
    return this.commandBus.execute(new RegisterCommand(body))
  }

}