import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import { BaseModel } from '@my-guardian-api/database/models/base.model'
import { ShopModel } from '@my-guardian-api/database/models/shop.model'

@Entity('shop_prices')
export class ShopPriceModel extends BaseModel {
  @Column()
  name: string

  @Column({
    type: 'decimal',
    precision: 6,
    scale: 2
  })
  price: number

  @ManyToOne(() => ShopModel, x => x.schedules)
  @JoinColumn({
    name: 'shop_id'
  })
  shop: ShopModel
}