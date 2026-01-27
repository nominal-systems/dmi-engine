import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import Statsig from 'statsig-node'
import { type StatsigUser } from 'statsig-node'
import { type AppConfig } from '../config/configuration.interface'
import { StatsigFeatureFlagsService } from './statsig-feature-flags.service'

@Injectable()
export class StatsigHeartbeatService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(StatsigHeartbeatService.name)
  private readonly statsigConfig = this.configService.getOrThrow<AppConfig['statsig']>('statsig')
  private intervalHandle: NodeJS.Timeout | undefined

  constructor(
    private readonly configService: ConfigService<AppConfig>,
    private readonly statsigFeatureFlagsService: StatsigFeatureFlagsService
  ) {}

  onModuleInit(): void {
    const intervalMs = this.statsigConfig.heartbeatIntervalMs
    if (
      !this.statsigConfig.enabled ||
      this.statsigConfig.serverSecretKey === '' ||
      intervalMs <= 0 ||
      Number.isNaN(intervalMs)
    ) {
      return
    }

    const user: StatsigUser = { userID: 'statsig-heartbeat' }
    this.intervalHandle = setInterval(() => {
      const gate = this.statsigConfig.heartbeatGate
      const gateEnabled = gate !== '' ? this.statsigFeatureFlagsService.isEnabled(gate, { userID: user.userID }) : false

      try {
        Statsig.logEvent(user, this.statsigConfig.heartbeatEventName, undefined, {
          gate,
          gateEnabled
        })
      } catch (error) {
        this.logger.warn('Failed to send Statsig heartbeat event', error as Error)
      }
    }, intervalMs)

    // Avoid keeping the process alive solely because of this interval.
    this.intervalHandle.unref()
    this.logger.log(
      `Statsig heartbeat enabled: interval=${intervalMs}ms gate=${this.statsigConfig.heartbeatGate} event=${this.statsigConfig.heartbeatEventName}`
    )
  }

  onModuleDestroy(): void {
    if (this.intervalHandle !== undefined) {
      clearInterval(this.intervalHandle)
      this.intervalHandle = undefined
    }
  }
}
