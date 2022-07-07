import * as winston from 'winston'
import { utilities as nestWinstonModuleUtilities } from 'nest-winston/dist/winston.utilities'

export const consoleTransport = new winston.transports.Console({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.ms(),
    nestWinstonModuleUtilities.format.nestLike('dmi-api', { prettyPrint: true })
  )
})

export const fileTransport = new winston.transports.File({
  filename: 'logs/dmi-engine.log',
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.ms(),
    nestWinstonModuleUtilities.format.nestLike('dmi-api', { prettyPrint: true })
  )
})
