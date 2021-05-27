import { SetMetadata } from '@nestjs/common'
import { RoleEnum } from '@my-guardian-api/common'

export const Roles = (...roles: RoleEnum[]) => SetMetadata('roles', roles)
