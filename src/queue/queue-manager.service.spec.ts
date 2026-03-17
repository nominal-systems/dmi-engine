import { Test, type TestingModule } from '@nestjs/testing'
import { ConfigService } from '@nestjs/config'
import { ModuleRef } from '@nestjs/core'
import { type ExistingIntegrationPayload, type IPayload, type NewIntegrationPayload } from '@nominal-systems/dmi-engine-common'
import { QueueManager } from './queue-manager.service'

const mockQueue = {
  name: 'test-provider.results',
  getJobs: jest.fn(),
  getRepeatableJobs: jest.fn(),
  getJobCounts: jest.fn(),
  add: jest.fn(),
  removeRepeatable: jest.fn(),
  on: jest.fn()
}

describe('QueueManager', () => {
  let service: QueueManager

  beforeEach(async () => {
    jest.clearAllMocks()

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QueueManager,
        {
          provide: ConfigService,
          useValue: {
            getOrThrow: jest.fn().mockReturnValue({ repeat: { every: 60000 } })
          }
        },
        {
          provide: 'QUEUE_NAMES',
          useValue: ['test-provider.results']
        },
        {
          provide: 'JOB_OPTIONS',
          useValue: {}
        },
        {
          provide: ModuleRef,
          useValue: {
            get: jest.fn().mockReturnValue(mockQueue)
          }
        }
      ]
    }).compile()

    service = module.get<QueueManager>(QueueManager)
  })

  describe('onModuleInit', () => {
    it('should initialize queues successfully', async () => {
      mockQueue.getJobs.mockResolvedValue([])
      mockQueue.getRepeatableJobs.mockResolvedValue([])

      await service.onModuleInit()

      expect(service.getQueueNames()).toEqual(['test-provider.results'])
      expect(service.cacheErrorCount).toBe(0)
    })

    it('should handle Redis failure during initialization gracefully', async () => {
      mockQueue.getJobs.mockRejectedValue(new Error('Redis connection refused'))
      mockQueue.getRepeatableJobs.mockResolvedValue([])

      await service.onModuleInit()

      expect(service.cacheErrorCount).toBe(1)
    })
  })

  describe('startPollingJobsForIntegration', () => {
    beforeEach(async () => {
      mockQueue.getJobs.mockResolvedValue([])
      mockQueue.getRepeatableJobs.mockResolvedValue([])
      await service.onModuleInit()
    })

    it('should start polling jobs successfully', async () => {
      mockQueue.add.mockResolvedValue({})
      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
      const payload: IPayload<NewIntegrationPayload> = {} as IPayload<NewIntegrationPayload>

      await service.startPollingJobsForIntegration('test-provider', 'integration-1', payload)

      expect(mockQueue.add).toHaveBeenCalledWith({}, { repeat: { every: 60000 }, jobId: 'integration-1' })
      expect(service.cacheErrorCount).toBe(0)
    })

    it('should not throw on Redis failure and increment error count', async () => {
      mockQueue.add.mockRejectedValue(new Error('READONLY'))
      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
      const payload: IPayload<NewIntegrationPayload> = {} as IPayload<NewIntegrationPayload>

      await expect(
        service.startPollingJobsForIntegration('test-provider', 'integration-1', payload)
      ).resolves.not.toThrow()

      expect(service.cacheErrorCount).toBe(1)
    })
  })

  describe('stopPollingJobsForIntegration', () => {
    beforeEach(async () => {
      mockQueue.getJobs.mockResolvedValue([])
      mockQueue.getRepeatableJobs.mockResolvedValue([])
      await service.onModuleInit()
    })

    it('should stop polling jobs successfully', async () => {
      mockQueue.removeRepeatable.mockResolvedValue(undefined)

      await service.stopPollingJobsForIntegration('test-provider', 'integration-1')

      expect(mockQueue.removeRepeatable).toHaveBeenCalled()
      expect(service.cacheErrorCount).toBe(0)
    })

    it('should not throw on Redis failure and increment error count', async () => {
      mockQueue.removeRepeatable.mockRejectedValue(new Error('CLUSTERDOWN'))

      await expect(
        service.stopPollingJobsForIntegration('test-provider', 'integration-1')
      ).resolves.not.toThrow()

      expect(service.cacheErrorCount).toBe(1)
    })
  })

  describe('updatePollingJobsForIntegration', () => {
    beforeEach(async () => {
      mockQueue.getJobs.mockResolvedValue([])
      mockQueue.getRepeatableJobs.mockResolvedValue([])
      await service.onModuleInit()
    })

    it('should not throw when both stop and start fail', async () => {
      mockQueue.removeRepeatable.mockRejectedValue(new Error('Redis timeout'))
      mockQueue.add.mockRejectedValue(new Error('Redis timeout'))
      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
      const payload: IPayload<ExistingIntegrationPayload> = {} as IPayload<ExistingIntegrationPayload>

      await expect(
        service.updatePollingJobsForIntegration('test-provider', 'integration-1', payload)
      ).resolves.not.toThrow()

      expect(service.cacheErrorCount).toBe(2)
    })
  })

  describe('getJobCounts', () => {
    beforeEach(async () => {
      mockQueue.getJobs.mockResolvedValue([])
      mockQueue.getRepeatableJobs.mockResolvedValue([])
      await service.onModuleInit()
    })

    it('should return job counts on success', async () => {
      const counts = { active: 1, waiting: 2, completed: 3, failed: 0, delayed: 0 }
      mockQueue.getJobCounts.mockResolvedValue(counts)

      const result = await service.getJobCounts('test-provider.results')

      expect(result).toEqual(counts)
      expect(service.cacheErrorCount).toBe(0)
    })

    it('should return null on Redis failure', async () => {
      mockQueue.getJobCounts.mockRejectedValue(new Error('Connection lost'))

      const result = await service.getJobCounts('test-provider.results')

      expect(result).toBeNull()
      expect(service.cacheErrorCount).toBe(1)
    })

    it('should return null for unknown queue', async () => {
      const result = await service.getJobCounts('nonexistent-queue')

      expect(result).toBeNull()
    })
  })
})
