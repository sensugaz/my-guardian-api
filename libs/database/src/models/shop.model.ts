import { Column, Entity, OneToMany } from 'typeorm'
import { BaseModel } from '@my-guardian-api/database/models/base.model'
import { ShopScheduleModel } from '@my-guardian-api/database/models/shop-schedule.model'
import { ShopPriceModel } from '@my-guardian-api/database/models/shop-price.model'

@Entity('shops')
export class ShopModel extends BaseModel {
  @Column({
    type: 'uuid',
    name: 'user_id'
  })
  userId: string

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

  @OneToMany(() => ShopScheduleModel, x => x.shop, {
    cascade: true,
    eager: true
  })
  schedules: ShopScheduleModel[]

  @OneToMany(() => ShopPriceModel, x => x.shop, {
    cascade: true,
    eager: true
  })
  prices: ShopPriceModel[]

  addSchedule(schedule: ShopScheduleModel) {
    if (!this.schedules) {
      this.schedules = []
    }

    this.schedules.push(schedule)
  }

  addPrice(price: ShopPriceModel) {
    if (!this.prices) {
      this.prices = []
    }

    this.prices.push(price)
  }

  updateProfile(profile: { name: string, address: string, geolocation: any, available: number }) {
    this.name = profile.name
    this.address = profile.address
    this.geolocation = profile.geolocation
    this.available = profile.available
  }

  clearSchedules() {
    this.schedules = []
  }

  clearPrices() {
    this.prices = []
  }
}