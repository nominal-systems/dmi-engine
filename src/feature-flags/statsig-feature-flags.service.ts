import { Inject, Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import Statsig from 'statsig-node'
import { type StatsigOptions, type StatsigUser } from 'statsig-node'
import { type AppConfig } from '../config/configuration.interface'
import {
  FEATURE_FLAG_PROVIDER,
  type FeatureFlagContext,
  type FeatureFlagProvider
} from '@nominal-systems/dmi-engine-antech-v6-integration'

type StatsigCustom = NonNullable<StatsigUser['custom']>

const isStringArray = (value: unknown): value is string[] => {
  return Array.isArray(value) && value.every((entry) => typeof entry === 'string')
}

const toStatsigCustom = (custom?: Record<string, unknown>): StatsigCustom | undefined => {
  if (custom === undefined) {
    return undefined
  }

  const mapped: StatsigCustom = {}
  for (const [key, value] of Object.entries(custom)) {
    if (
      typeof value === 'string' ||
      typeof value === 'number' ||
      typeof value === 'boolean' ||
      isStringArray(value) ||
      value === undefined
    ) {
      mapped[key] = value
    }
  }

  return Object.keys(mapped).length > 0 ? mapped : undefined
}

@Injectable()
export class StatsigFeatureFlagsService implements FeatureFlagProvider, OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(StatsigFeatureFlagsService.name)
  private initialized = false
  private readonly statsigConfig = this.configService.getOrThrow<AppConfig['statsig']>('statsig')

  constructor(@Inject(ConfigService) private readonly configService: ConfigService<AppConfig>) {}

  async onModuleInit(): Promise<void> {
    if (!this.statsigConfig.enabled) {
      this.logger.log('Statsig is disabled via STATSIG_ENABLED')
      return
    }

    if (this.statsigConfig.serverSecretKey === '') {
      this.logger.warn('Statsig is enabled but STATSIG_SERVER_SECRET_KEY is not set; falling back to overrides only')
      return
    }

    const options: StatsigOptions = {
      environment: {
        tier: this.statsigConfig.environment
      }
    }

    try {
      await Statsig.initialize(this.statsigConfig.serverSecretKey, options)
      this.initialized = true
      this.logger.log(`Statsig initialized (environment=${this.statsigConfig.environment})`)
    } catch (error) {
      this.logger.error('Failed to initialize Statsig; feature gates will default to disabled', error as Error)
      this.initialized = false
    }
  }

  async onModuleDestroy(): Promise<void> {
    if (!this.initialized) {
      return
    }

    await Statsig.shutdown()
    this.initialized = false
  }

  isEnabled(flag: string, context?: FeatureFlagContext): boolean {
    const override = this.statsigConfig.overrides[flag]
    if (override !== undefined) {
      return override
    }

    if (!this.statsigConfig.enabled || !this.initialized) {
      return false
    }

    const user: StatsigUser = {
      userID: context?.userID ?? 'dmi-engine',
      custom: toStatsigCustom(context?.custom)
    }

    try {
      return Statsig.checkGateSync(user, flag)
    } catch (error) {
      this.logger.error(`Statsig gate check failed for flag '${flag}'`, error as Error)
      return false
    }
  }
}

export const statsigFeatureFlagProvider = {
  provide: FEATURE_FLAG_PROVIDER,
  useExisting: StatsigFeatureFlagsService
}
