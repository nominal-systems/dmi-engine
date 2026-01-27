import { ConfigService } from '@nestjs/config'
import Statsig from 'statsig-node'
import { type AppConfig } from '../config/configuration.interface'
import { StatsigFeatureFlagsService } from './statsig-feature-flags.service'
import { StatsigHeartbeatService } from './statsig-heartbeat.service'

jest.mock('statsig-node', () => ({
  __esModule: true,
  default: {
    initialize: jest.fn(),
    checkGateSync: jest.fn(),
    shutdown: jest.fn(),
    logEvent: jest.fn()
  }
}))

const statsigMock = jest.requireMock('statsig-node').default as Record<string, jest.Mock>

const createConfigService = (statsigConfig: AppConfig['statsig']): ConfigService<AppConfig> => {
  return {
    getOrThrow: jest.fn().mockImplementation((key: keyof AppConfig) => {
      if (key === 'statsig') {
        return statsigConfig
      }
      throw new Error(`Unexpected config key: ${String(key)}`)
    })
  } as unknown as ConfigService<AppConfig>
}

describe('StatsigHeartbeatService', () => {
  beforeEach(() => {
    jest.useFakeTimers()
    jest.clearAllMocks()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('logs heartbeat events on an interval when enabled', () => {
    const configService = createConfigService({
      enabled: true,
      serverSecretKey: 'secret-key',
      environment: 'test',
      overrides: {},
      heartbeatIntervalMs: 10,
      heartbeatGate: 'antech_v6_statsig_test_log',
      heartbeatEventName: 'statsig_heartbeat'
    })
    const featureFlagsService = {
      isEnabled: jest.fn().mockReturnValue(true)
    } as unknown as StatsigFeatureFlagsService

    const service = new StatsigHeartbeatService(configService, featureFlagsService)
    service.onModuleInit()
    jest.advanceTimersByTime(25)

    expect(statsigMock.logEvent).toHaveBeenCalled()

    const callCountAfterTicks = statsigMock.logEvent.mock.calls.length
    service.onModuleDestroy()
    jest.advanceTimersByTime(25)

    expect(statsigMock.logEvent.mock.calls.length).toBe(callCountAfterTicks)
  })
})
