import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm'
import { BaseModel } from '@my-guardian-api/database/models/base.model'
import { UserModel } from '@my-guardian-api/database/models/user.model'
import { ApiHideProperty } from '@nestjs/swagger'
import { ApiException } from '@my-guardian-api/common'
import * as moment from 'moment'

@Entity('user_tokens')
@Unique(['token'])
export class UserTokenModel extends BaseModel {
  @Column()
  token: string

  @Column({
    type: 'timestamp',
    name: 'expired_date',
    nullable: true
  })
  expiredDate: Date

  @Column()
  type: string

  @Column({
    type: 'boolean',
    name: 'used',
    default: false
  })
  used: boolean

  @ApiHideProperty()
  @ManyToOne(() => UserModel, x => x.tokens)
  @JoinColumn({
    name: 'user_id'
  })
  user: UserModel

  usedToken() {
    this.isUsed()

    this.used = true
  }

  isUsed() {
    if (this.used) {
      throw new ApiException({
        module: 'common',
        type: 'domain',
        codes: ['token_has_been_used'],
        statusCode: 400
      })
    }
  }

  isExpired() {
    if (this.expiredDate) {
      const isExpired = moment(this.expiredDate).diff(moment().utc(), 'seconds') <= 0

      if (isExpired) {
        throw new ApiException({
          module: 'common',
          type: 'application',
          codes: ['token_is_expired'],
          statusCode: 400
        })
      }
    }

    return false
  }
}