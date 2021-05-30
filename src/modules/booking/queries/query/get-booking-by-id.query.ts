import { UserModel } from '@my-guardian-api/database'

export class GetBookingByIdQuery {
  constructor(public readonly user: UserModel,
              public readonly bookingId: string) {
  }
}