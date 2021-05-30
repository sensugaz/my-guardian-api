import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Put,
  Query,
  Redirect,
  Req,
  UseGuards
} from '@nestjs/common'
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger'
import { CommandBus, QueryBus } from '@nestjs/cqrs'
import {
  ActivateDto,
  ChangePasswordDto,
  CheckTokenDto,
  ForgotPasswordDto,
  LoginDto,
  RegisterDto,
  ResetPasswordDto,
  UpdateProfileDto
} from '../dtos'
import { UserModel, UserTokenModel } from '@my-guardian-api/database'
import {
  ActivateCommand,
  ChangePasswordCommand,
  DeleteUserCommand,
  ForgotPasswordCommand,
  LoginCommand,
  RegisterCommand,
  ResetPasswordCommand,
  UpdateProfileCommand
} from '../commands/command'
import { AuthGuard } from '@nestjs/passport'
import { CheckTokenQuery, ProfileQuery } from '../queries/query'
import { RolesGuard } from '@my-guardian-api/auth'
import { Roles } from '@my-guardian-api/auth/decorators'
import { ApiException, RoleEnum } from '@my-guardian-api/common'

@ApiTags('users')
@Controller('/users')
export class UserController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus
  ) {
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
  resetPassword(
    @Query() query: { token: string },
    @Body() body: ResetPasswordDto
  ): Promise<UserModel> {
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
  changePassword(
    @Req() req,
    @Body() body: ChangePasswordDto
  ): Promise<UserModel> {
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

  @Put('/profile')
  @ApiBearerAuth()
  @UseGuards(AuthGuard(['jwt']), RolesGuard)
  @Roles(RoleEnum.CUSTOMER)
  @HttpCode(HttpStatus.OK)
  updateProfile(
    @Req() req,
    @Body() body: UpdateProfileDto
  ): Promise<UserModel> {
    return this.commandBus.execute(new UpdateProfileCommand(req.user, body))
  }

  @Get('/redirect')
  @ApiQuery({
    name: 'token',
    required: true
  })
  @ApiQuery({
    name: 'type',
    required: true
  })
  @Redirect('', HttpStatus.MOVED_PERMANENTLY)
  redirect(@Req() req, @Query() query: { type: string; token: string }) {
    const useragent = req.useragent
    let mobileUrl,
      webUrl = null

    switch (query.type) {
      case 'register':
        mobileUrl = `moto://Login/${query.token}`
        webUrl = `https://www.myguardian.fr/confirmation-de-compte?token=${query.token}`
        break
      case 'forgot-password':
        mobileUrl = `moto://ForgotPassword/${query.token}`
        webUrl = `https://www.myguardian.fr/confirmation-de-compte?token=${query.token}`
        break
      default:
        throw new ApiException({
          type: 'application',
          module: 'user',
          codes: ['invalid_type'],
          statusCode: HttpStatus.BAD_REQUEST
        })
    }
    if (useragent.isMobile || useragent.isMobileNative) {
      return { url: mobileUrl }
    } else {
      return { url: webUrl }
    }
  }

  @Get('/check-token')
  @ApiQuery({
    name: 'token',
    required: true
  })
  checkToken(@Query() query: CheckTokenDto): Promise<UserTokenModel> {
    return this.queryBus.execute(new CheckTokenQuery(query))
  }
}
