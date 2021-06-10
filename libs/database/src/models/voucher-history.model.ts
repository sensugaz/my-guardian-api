import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import { ApiHideProperty } from '@nestjs/swagger'
import { BaseModel } from '@my-guardian-api/database/models/base.model'
import { UserModel } from '@my-guardian-api/database/models/user.model'

@Entity('voucher_histories')
export class VoucherHistoryModel extends BaseModel {
  @ApiHideProperty()
  @ManyToOne(() => UserModel, (x) => x.vouchers, { onDelete: 'CASCADE' })
  @JoinColumn({
    name: 'user_id',
  })
  user: UserModel

  @Column()
  code: string
}
