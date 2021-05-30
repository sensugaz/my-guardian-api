import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm'
import { BaseModel } from '@my-guardian-api/database/models/base.model'
import { ShopModel } from '@my-guardian-api/database/models/shop.model'
import { CustomerModel } from '@my-guardian-api/database/models/customer.model'
import { BookingBagStatusEnum, BookingStatusEnum, PaymentStatusEnum } from '@my-guardian-api/common'
import { BookingBagModel } from '@my-guardian-api/database/models/booking-bag.model'

@Entity('bookings')
export class BookingModel extends BaseModel {
  @ManyToOne(() => ShopModel, (x) => x.bookings)
  @JoinColumn({
    name: 'shop_id'
  })
  shop: ShopModel

  @ManyToOne(() => CustomerModel, (x) => x.bookings)
  @JoinColumn({
    name: 'customer_id'
  })
  customer: CustomerModel

  @Column({
    name: 'voucher_code',
    nullable: true
  })
  voucherCode: string

  @Column({
    name: 'schedule_day'
  })
  scheduleDay: string

  @Column({
    name: 'schedule_open_time'
  })
  scheduleOpenTime: string

  @Column({
    name: 'schedule_close_time'
  })
  scheduleCloseTime: string

  @Column()
  type: string

  @Column()
  qty: number

  @Column({
    type: 'decimal',
    precision: 6,
    scale: 2
  })
  amount: number

  @Column({
    type: 'decimal',
    precision: 6,
    scale: 2
  })
  discount: number

  @Column({
    type: 'decimal',
    precision: 6,
    scale: 2,
    name: 'total_amount'
  })
  totalAmount: number

  @Column({
    type: 'varchar',
    name: 'payment_status'
  })
  paymentStatus: PaymentStatusEnum

  @Column({
    type: 'varchar',
    name: 'booking_status'
  })
  bookingStatus: BookingStatusEnum

  @Column({
    type: 'varchar',
    name: 'booking_bag_status'
  })
  bookingBagStatus: BookingBagStatusEnum

  @OneToMany(() => BookingBagModel, (x) => x.booking, {
    cascade: true,
    eager: true
  })
  bags: BookingBagModel[]

  updatePaymentStatus(status: PaymentStatusEnum) {
    this.paymentStatus = status
  }

  updateBookingStatus(status: BookingStatusEnum) {
    this.bookingStatus = status
  }

  dropped(bag: BookingBagModel) {
    if (!bag) {
      this.bags = []
    }

    this.bags.push(bag)
  }

  withdraw() {
    for (const bag of this.bags) {
      bag.withdraw()
    }

    this.bookingBagStatus = BookingBagStatusEnum.WITHDRAW
  }
}
