export type ApiExceptionType = {
  statusCode: number
  module?: string
  type: 'application' | 'validation' | 'domain' | 'infrastructure'
  codes: string[]
}
