import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import { ShopBagStatusEnum } from '@my-guardian-api/common'
import { BaseModel } from '@my-guardian-api/database/models/base.model'
import { ShopModel } from '@my-guardian-api/database/models/shop.model'

@Entity('shop_bags')
export class ShopBagModel extends BaseModel {
  @ManyToOne(() => ShopModel, (x) => x.bookings)
  @JoinColumn({
    name: 'shop_id'
  })
  shop: ShopModel

  @Column()
  number: string

  @Column()
  status: ShopBagStatusEnum

  setStatus(status: ShopBagStatusEnum) {
    this.status = status
  }
}
