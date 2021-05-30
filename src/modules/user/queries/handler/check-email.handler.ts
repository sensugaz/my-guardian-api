import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { InjectRepository } from '@nestjs/typeorm'
import { UserRepository } from '@my-guardian-api/database/repositories'
import { CheckEmailQuery } from '../query'

@QueryHandler(CheckEmailQuery)
export class CheckEmailHandler implements IQueryHandler<CheckEmailQuery> {
  constructor(@InjectRepository(UserRepository)
              private readonly userRepository: UserRepository) {
  }

  async execute({ email }: CheckEmailQuery): Promise<{ exists: boolean }> {
    const user = await this.userRepository.findOne({ email })

    return {
      exists: !!user
    }
  }
}
