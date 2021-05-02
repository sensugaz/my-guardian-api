import { Column, Entity, JoinColumn, ManyToOne, OneToMany, Unique } from 'typeorm'
import { BaseModel } from '@my-guardian-api/database/models/base.model'
import { UserTokenModel } from '@my-guardian-api/database/models/user-token.model'
import { ApiHideProperty } from '@nestjs/swagger'
import { RoleModel } from '@my-guardian-api/database/models/role.model'

@Entity('users')
@Unique(['email'])
export class UserModel extends BaseModel {
  @Column()
  email: string

  @Column()
  @ApiHideProperty()
  password: string

  @Column()
  @ApiHideProperty()
  salt: string

  @Column({
    name: 'is_activate'
  })
  isActivate: boolean

  @ApiHideProperty()
  @OneToMany(() => UserTokenModel, x => x.user, {
    cascade: true
  })
  tokens: UserTokenModel[]

  @ManyToOne(() => RoleModel, x => x.user, {
    cascade: true,
    eager: true
  })
  @JoinColumn({
    name: 'role_id'
  })
  role: RoleModel

  addToken(token: UserTokenModel) {
    if (!this.tokens) {
      this.tokens = []
    }

    this.tokens.push(token)
  }
}