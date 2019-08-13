import { Errors } from 'ilp-packet'
import { Rule } from '../types/rule'
import { log } from '../winston'
import { AppServices } from '../services'
const logger = log.child({ component: 'expire-rule' })

const { TransferTimedOutError } = Errors

export class ExpireRule extends Rule {

  constructor (services: AppServices) {
    super(services, {
      outgoing: async ({ state: { ilp } }, next) => {
        const { expiresAt } = ilp.req
        const duration = expiresAt.getTime() - Date.now()
        const timeout = setTimeout(() => {
          logger.debug('packet expired', { ilp })
          throw new TransferTimedOutError('packet expired.')
        }, duration)
        await next()
        clearTimeout(timeout)
      }
    })
  }
}
