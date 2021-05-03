import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import { BaseModel } from '@my-guardian-api/database/models/base.model'
import { ShopModel } from '@my-guardian-api/database/models/shop.model'

@Entity('shop_schedules')
export class ShopScheduleModel extends BaseModel {
  @Column()
  day: string

  @Column({
    type: 'time',
    name: 'open_time'
  })
  openTime: Date

  @Column({
    type: 'time',
    name: 'close_time'
  })
  closeTime: Date

  @Column({
    name: 'is_close'
  })
  isClose: boolean

  @ManyToOne(() => ShopModel, x => x.schedules)
  @JoinColumn({
    name: 'shop_id'
  })
  shop: ShopModel
}