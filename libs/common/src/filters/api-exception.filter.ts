import { ArgumentsHost, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common'
import { classToPlain } from 'class-transformer'
import { ApiException, ResponseException } from '@my-guardian-api/common/exceptions'
import { ApiExceptionType } from '@my-guardian-api/common/types'

export class ApiExceptionFilter implements ExceptionFilter {
  private static getActionType(method: string) {
    return method === 'get' ? 'query' : 'command'
  }

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse()
    const request = ctx.getRequest()
    const requestId = request.headers['x-request-id']
    const { user, method, url } = request

    let status = HttpStatus.INTERNAL_SERVER_ERROR

    const exceptionResponse = new ResponseException({
      statusCode: status,
      type: 'infrastructure',
      actionType: ApiExceptionFilter.getActionType(method),
      path: url,
      codes: [],
      requestId,
      userId: user ? user.id : null,
      method
    })

    if (exception instanceof Error) {
      const { message } = exception
      exceptionResponse.codes = [message]
    } else {
      exceptionResponse.codes = ['INTERNAL_SERVER']
    }

    if (exception instanceof HttpException) {
      exceptionResponse.statusCode = exception.getStatus()
      status = exception.getStatus()
      exceptionResponse.type = 'validation'
    }

    if (exception instanceof ApiException) {
      const {
        module,
        type,
        codes,
        statusCode
      } = exception.getResponse() as ApiExceptionType
      status = statusCode
      exceptionResponse.statusCode = statusCode
      exceptionResponse.type = type
      exceptionResponse.module = module
      exceptionResponse.codes = codes
    }
    
    return response.status(status).json(classToPlain(exceptionResponse))
  }
}
