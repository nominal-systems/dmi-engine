import { ConfigService } from '@nestjs/config'
import { StatsigFeatureFlagsService } from './statsig-feature-flags.service'
import Statsig from 'statsig-node'
import { type AppConfig } from '../config/configuration.interface'

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

describe('StatsigFeatureFlagsService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('returns overrides even when Statsig is disabled', () => {
    const configService = createConfigService({
      enabled: false,
      serverSecretKey: '',
      environment: 'test',
      overrides: {
        antech_v6_legacy_test_results: true
      },
      heartbeatIntervalMs: 0,
      heartbeatGate: 'antech_v6_statsig_test_log',
      heartbeatEventName: 'statsig_heartbeat'
    })
    const service = new StatsigFeatureFlagsService(configService)

    expect(service.isEnabled('antech_v6_legacy_test_results')).toBe(true)
    expect(statsigMock.checkGateSync).not.toHaveBeenCalled()
  })

  it('checks gates after successful initialization', async () => {
    statsigMock.initialize.mockResolvedValue(undefined)
    statsigMock.checkGateSync.mockReturnValue(true)

    const configService = createConfigService({
      enabled: true,
      serverSecretKey: 'secret-key',
      environment: 'test',
      overrides: {},
      heartbeatIntervalMs: 0,
      heartbeatGate: 'antech_v6_statsig_test_log',
      heartbeatEventName: 'statsig_heartbeat'
    })
    const service = new StatsigFeatureFlagsService(configService)

    await service.onModuleInit()

    expect(service.isEnabled('a_gate')).toBe(true)
    expect(statsigMock.initialize).toHaveBeenCalledWith('secret-key', {
      environment: { tier: 'test' }
    })
    expect(statsigMock.checkGateSync).toHaveBeenCalled()
  })
})
