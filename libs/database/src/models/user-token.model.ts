import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm'
import { BaseModel } from '@my-guardian-api/database/models/base.model'
import { UserModel } from '@my-guardian-api/database/models/user.model'
import { ApiHideProperty } from '@nestjs/swagger'
import { ApiException } from '@my-guardian-api/common'

@Entity('user_tokens')
@Unique(['token'])
export class UserTokenModel extends BaseModel {
  @Column()
  token: string

  @Column({
    type: 'timestamp',
    name: 'expired_at',
    nullable: true
  })
  expiredAt: Date

  @Column()
  type: string

  @Column({
    type: 'boolean',
    name: 'is_used',
    default: false
  })
  isUsed: boolean

  @ApiHideProperty()
  @ManyToOne(() => UserModel, x => x.tokens)
  @JoinColumn({
    name: 'user_id'
  })
  user: UserModel

  usedToken() {
    if (this.isUsed) {
      throw new ApiException({
        module: 'common',
        type: 'domain',
        codes: ['token_has_been_used'],
        statusCode: 400
      })
    }

    this.isUsed = true
  }
}