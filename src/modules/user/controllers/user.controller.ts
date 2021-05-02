import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Post, Put, Query, Req, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger'
import { CommandBus, QueryBus } from '@nestjs/cqrs'
import { ActivateDto, ChangePasswordDto, ForgotPasswordDto, LoginDto, RegisterDto, ResetPasswordDto } from '../dtos'
import { UserModel } from '@my-guardian-api/database'
import {
  ActivateCommand,
  ChangePasswordCommand,
  DeleteUserCommand,
  ForgotPasswordCommand,
  LoginCommand,
  RegisterCommand,
  ResetPasswordCommand
} from '../commands/command'
import { AuthGuard } from '@nestjs/passport'
import { ProfileQuery } from '../queries/query'
import { RolesGuard } from '@my-guardian-api/auth'
import { Roles } from '@my-guardian-api/auth/decorators'
import { RoleEnum } from '@my-guardian-api/common'

@ApiTags('/users')
@Controller('/users')
export class UserController {
  constructor(private readonly commandBus: CommandBus,
              private readonly queryBus: QueryBus) {
  }

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  login(@Body() body: LoginDto): Promise<{ accessToken: string }> {
    return this.commandBus.execute(new LoginCommand(body))
  }

  @Post('/register')
  @HttpCode(HttpStatus.OK)
  register(@Body() body: RegisterDto): Promise<UserModel> {
    return this.commandBus.execute(new RegisterCommand(body))
  }

  @Get('/activate')
  @ApiQuery({
    name: 'token',
    required: true
  })
  activate(@Query() token: ActivateDto): Promise<UserModel> {
    return this.commandBus.execute(new ActivateCommand(token))
  }

  @Post('/forgot-password')
  @HttpCode(HttpStatus.OK)
  forgotPassword(@Body() body: ForgotPasswordDto): Promise<UserModel> {
    return this.commandBus.execute(new ForgotPasswordCommand(body))
  }

  @Post('/reset-password')
  @ApiQuery({
    name: 'token',
    required: true
  })
  resetPassword(@Query() query: { token: string }, @Body() body: ResetPasswordDto): Promise<UserModel> {
    return this.commandBus.execute(new ResetPasswordCommand(query, body))
  }

  @Get('/profile')
  @ApiBearerAuth()
  @UseGuards(AuthGuard(['jwt']))
  @HttpCode(HttpStatus.OK)
  profile(@Req() req): Promise<UserModel> {
    return this.queryBus.execute(new ProfileQuery(req.user))
  }

  @Put('/change-password')
  @ApiBearerAuth()
  @UseGuards(AuthGuard(['jwt']))
  @HttpCode(HttpStatus.OK)
  changePassword(@Req() req, @Body() body: ChangePasswordDto): Promise<UserModel> {
    return this.commandBus.execute(new ChangePasswordCommand(req.user, body))
  }

  @Delete()
  @ApiBearerAuth()
  @UseGuards(AuthGuard(['jwt']), RolesGuard)
  @Roles(RoleEnum.CUSTOMER)
  @HttpCode(HttpStatus.OK)
  deleteUser(@Req() req): Promise<UserModel> {
    return this.commandBus.execute(new DeleteUserCommand(req.user))
  }
}