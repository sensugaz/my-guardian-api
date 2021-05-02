import { CanActivate, ExecutionContext, HttpStatus, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { ApiException, RoleEnum } from '@my-guardian-api/common'

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {
  }

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<RoleEnum[]>('roles', context.getHandler())

    if (!roles) {
      return true
    }

    const request = context.switchToHttp().getRequest()
    const user = request.user

    const hasRole = roles.find(i => i === user?.role?.key)

    if (!hasRole) {
      throw new ApiException({
        type: 'infrastructure',
        module: 'auth',
        codes: ['role_has_no_access'],
        statusCode: HttpStatus.UNAUTHORIZED
      })
    }

    return true
  }
}