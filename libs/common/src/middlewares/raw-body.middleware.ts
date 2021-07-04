import { Injectable, NestMiddleware } from '@nestjs/common'
import { json } from 'body-parser'

@Injectable()
export class RawBodyMiddleware implements NestMiddleware {
  public use(req: any, res: any, next: () => any): any {
    json({
      verify: (req: any, res, buffer) => {
        if (Buffer.isBuffer(buffer)) {
          req['parsedRawBody'] = Buffer.from(buffer)
        }
        return true
      }
    })(req, res as any, next)
  }
}
