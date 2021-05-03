import * as ip from 'ip'
import * as os from 'os'
import { ApiExceptionType, ResponseExceptionType } from '@my-guardian-api/common/types'

export class ResponseException {
  constructor({
                module,
                type,
                actionType,
                path,
                codes = [],
                requestId,
                method,
                statusCode
              }: ApiExceptionType & ResponseExceptionType) {
    this.statusCode = statusCode
    this.method = method
    this.requestId = requestId
    this.ip = ip.address()
    this.host = os.hostname()
    this.system = 'my-guardian-api'
    this.module = module
    this.type = type
    this.actionType = actionType
    this.path = path
    this.codes = codes
    this.timestamp = new Date()
  }

  requestId: string
  ip: string
  host: string
  system: string
  module: ApiExceptionType['module']
  type: ApiExceptionType['type']
  actionType: ResponseExceptionType['actionType']
  path?: ResponseExceptionType['path']
  codes: ApiExceptionType['codes']
  timestamp: Date
  method: string
  statusCode: number
}
