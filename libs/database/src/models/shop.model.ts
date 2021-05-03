import { Column, Entity, OneToMany } from 'typeorm'
import { BaseModel } from '@my-guardian-api/database/models/base.model'
import { ShopScheduleModel } from '@my-guardian-api/database/models/shop-schedule.model'

@Entity('shops')
export class ShopModel extends BaseModel {
  @Column()
  name: string

  @Column({
    type: 'text'
  })
  address: string

  @Column({
    type: 'jsonb'
  })
  geolocation: {
    lat: string,
    lng: string
  }

  @Column()
  available: number

  @OneToMany(() => ShopScheduleModel, x => x.shop)
  schedules: ShopScheduleModel[]
}