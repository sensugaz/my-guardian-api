import { EntityRepository, Repository } from 'typeorm'
import { BookingBagModel } from '@my-guardian-api/database'

@EntityRepository(BookingBagModel)
export class BookingBagRepository extends Repository<BookingBagModel> {

}