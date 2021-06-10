import { BaseModel } from '@my-guardian-api/database/models/base.model'
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import { BookingModel } from '@my-guardian-api/database/models/booking.model'

@Entity('booking_bags')
export class BookingBagModel extends BaseModel {
  @ManyToOne(() => BookingModel, (x) => x.bags, { onDelete: 'CASCADE' })
  @JoinColumn({
    name: 'booking_id',
  })
  booking: BookingModel

  @Column()
  number: string

  @Column({
    type: 'timestamp without time zone',
    name: 'dropped_at',
    nullable: true,
  })
  droppedAt: Date

  @Column({
    type: 'timestamp without time zone',
    name: 'withdraw_at',
    nullable: true,
  })
  withdrawAt: Date

  withdraw() {
    this.withdrawAt = new Date()
  }
}
