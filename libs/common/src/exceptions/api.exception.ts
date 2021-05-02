import { HttpException } from '@nestjs/common'
import { ApiExceptionType } from '@my-guardian-api/common/types'

export class ApiException extends HttpException {
  constructor(apiExceptionType: ApiExceptionType) {
    super(apiExceptionType, apiExceptionType.statusCode)
  }
}