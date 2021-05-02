import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm'
import { BaseModel } from '@my-guardian-api/database/models/base.model'
import { UserModel } from '@my-guardian-api/database/models/user.model'
import { ApiHideProperty } from '@nestjs/swagger'

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
}