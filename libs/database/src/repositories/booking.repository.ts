import { EntityRepository, Repository } from 'typeorm'
import { BookingModel } from '@my-guardian-api/database'

@EntityRepository(BookingModel)
export class BookingRepository extends Repository<BookingModel> {

}