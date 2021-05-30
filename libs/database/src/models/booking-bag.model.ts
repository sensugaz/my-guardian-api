import { BaseModel } from '@my-guardian-api/database/models/base.model'
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import { BookingModel } from '@my-guardian-api/database/models/booking.model'

@Entity('booking_bags')
export class BookingBagModel extends BaseModel {
  @ManyToOne(() => BookingModel, (x) => x.bags)
  @JoinColumn({
    name: 'booking_id'
  })
  booking: BookingModel

  @Column()
  number: string

  // @Column('varchar')
  // status: BookingBagStatusEnum

  @Column({
    type: 'timestamp',
    name: 'dropped_at',
    nullable: true
  })
  droppedAt: Date

  @Column({
    type: 'timestamp',
    name: 'withdraw_at',
    nullable: true
  })
  withdrawAt: Date

  withdraw() {
    this.withdrawAt = new Date()
  }
}