import { Column, Entity } from 'typeorm'
import { BaseModel } from '@my-guardian-api/database/models/base.model'

@Entity('vouchers')
export class VoucherModel extends BaseModel {
  @Column()
  code: string

  @Column()
  name: string

  @Column({
    type: 'text',
    nullable: true
  })
  description: string

  @Column({
    type: 'decimal',
    precision: 6,
    scale: 2
  })
  percent: number

  updateVoucher(name: string, description: string, percent: number) {
    this.name = name
    this.description = description
    this.percent = percent
  }
}