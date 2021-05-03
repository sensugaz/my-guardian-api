import { Column, Entity } from 'typeorm'
import { ApiHideProperty } from '@nestjs/swagger'
import { BaseModel } from '@my-guardian-api/database/models/base.model'

@Entity('customers')
export class CustomerModel extends BaseModel {
  @ApiHideProperty()
  @Column({
    type: 'uuid',
    name: 'user_id'
  })
  userId: string

  @Column({
    name: 'first_name'
  })
  firstName: string

  @Column({
    name: 'last_name'
  })
  lastName: string

  @Column({
    name: 'phone_code'
  })
  phoneCode: string

  @Column({
    name: 'phone_number'
  })
  phoneNumber: string
  
  updateProfile(profile: { firstName: string, lastName: string, phoneCode: string, phoneNumber: string, isVerify?: boolean }) {
    this.firstName = profile?.firstName
    this.lastName = profile?.lastName
    this.phoneCode = profile?.phoneCode
    this.phoneNumber = profile?.phoneNumber
  }
}