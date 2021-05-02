export type ResponseExceptionType = {
  actionType: 'command' | 'query'
  path: string
  requestId: string
  method: string
  userId?: string
}