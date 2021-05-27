import { BaseModel } from '@my-guardian-api/database/models/base.model'
import { Column, Entity, OneToMany, Unique } from 'typeorm'
import { ApiHideProperty } from '@nestjs/swagger'
import { UserModel } from '@my-guardian-api/database/models/user.model'

@Entity('roles')
@Unique(['key'])
export class RoleModel extends BaseModel {
  @Column()
  key: string

  @Column()
  value: string

  @ApiHideProperty()
  @OneToMany(() => UserModel, (x) => x.role)
  user: UserModel[]
}
