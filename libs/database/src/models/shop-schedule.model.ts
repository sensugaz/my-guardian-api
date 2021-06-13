import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import { BaseModel } from '@my-guardian-api/database/models/base.model'
import { ShopModel } from '@my-guardian-api/database/models/shop.model'

@Entity('shop_schedules')
export class ShopScheduleModel extends BaseModel {
  @Column()
  day: string

  @Column({
    nullable: true,
    name: 'open_time',
  })
  openTime: string

  @Column({
    nullable: true,
    name: 'close_time',
  })
  closeTime: string

  @Column({
    name: 'is_close',
  })
  isClose: boolean

  @ManyToOne(() => ShopModel, (x) => x.schedules, { onDelete: 'CASCADE' })
  @JoinColumn({
    name: 'shop_id',
  })
  shop: ShopModel
}
