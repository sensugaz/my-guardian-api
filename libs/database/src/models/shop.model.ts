import { Column, Entity, OneToMany } from 'typeorm'
import { BaseModel } from '@my-guardian-api/database/models/base.model'
import { ShopScheduleModel } from '@my-guardian-api/database/models/shop-schedule.model'
import { ShopPriceModel } from '@my-guardian-api/database/models/shop-price.model'
import { BookingModel } from '@my-guardian-api/database/models/booking.model'

@Entity('shops')
export class ShopModel extends BaseModel {
  @Column({
    type: 'uuid',
    name: 'user_id'
  })
  userId: string

  @Column({
    nullable: true
  })
  name: string

  @Column({
    type: 'text',
    nullable: true
  })
  address: string

  @Column({
    type: 'jsonb',
    nullable: true
  })
  geolocation: {
    lat: string
    lng: string
  }

  @Column()
  available: number

  @Column({
    type: 'text',
    nullable: true
  })
  description: string

  @OneToMany(() => ShopScheduleModel, (x) => x.shop, {
    cascade: true,
    eager: true
  })
  schedules: ShopScheduleModel[]

  @OneToMany(() => ShopPriceModel, (x) => x.shop, {
    cascade: true,
    eager: true
  })
  prices: ShopPriceModel[]

  @OneToMany(() => BookingModel, (x) => x.shop, {
    cascade: true,
    eager: true
  })
  bookings: BookingModel[]

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

  updateProfile(profile: {
    name: string
    address: string
    geolocation: any
    available: number
    description: string
  }) {
    this.name = profile.name
    this.address = profile.address
    this.geolocation = profile.geolocation
    this.available = profile.available
    this.description = profile.description
  }

  clearSchedules() {
    this.schedules = []
  }

  clearPrices() {
    this.prices = []
  }

  decAvailable(num: number) {
    this.available -= Number(num)
  }

  incAvailable(num: number) {
    this.available += Number(num)
  }
}
