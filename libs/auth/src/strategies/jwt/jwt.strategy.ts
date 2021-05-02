import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { HttpStatus, Injectable } from '@nestjs/common'
import { EntityManager } from 'typeorm'
import { ConfigService } from '@nestjs/config'
import { UserModel } from '@my-guardian-api/database'
import { JwtPayload } from '@my-guardian-api/auth/strategies/jwt/jwt.payload'
import { ApiException } from '@my-guardian-api/common'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly entityManager: EntityManager,
              private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('JWT_SECRET')
    })
  }

  async validate(payload: JwtPayload): Promise<UserModel> {
    const user = await this.entityManager.findOne(UserModel, {
      id: payload.id
    })

    if (!user) {
      throw new ApiException({
        type: 'infrastructure',
        module: 'auth',
        codes: ['unauthorized'],
        statusCode: HttpStatus.UNAUTHORIZED
      })
    }

    return user
  }
}
