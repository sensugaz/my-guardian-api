import { Column, Entity, JoinColumn, ManyToOne, OneToMany, Unique } from 'typeorm'
import { BaseModel } from '@my-guardian-api/database/models/base.model'
import { UserTokenModel } from '@my-guardian-api/database/models/user-token.model'
import { ApiHideProperty } from '@nestjs/swagger'
import { RoleModel } from '@my-guardian-api/database/models/role.model'
import { ApiException } from '@my-guardian-api/common'

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
    cascade: ['insert', 'update'],
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

  activate() {
    if (this.isActivate) {
      throw new ApiException({
        module: 'common',
        type: 'domain',
        codes: ['user_already_activated'],
        statusCode: 400
      })
    }

    this.isActivate = true
  }

  changePassword(password: string, salt: string) {
    this.password = password
    this.salt = salt
  }
}