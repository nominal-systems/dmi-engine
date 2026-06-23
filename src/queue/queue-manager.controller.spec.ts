import { Test, type TestingModule } from '@nestjs/testing'
import { QueueManagerController } from './queue-manager.controller'
import { QueueManager } from './queue-manager.service'

describe('QueueManagerController', () => {
  let controller: QueueManagerController
  let queueManager: Partial<QueueManager>

  beforeEach(async () => {
    queueManager = {
      getQueueNames: jest.fn().mockReturnValue(['provider.results']),
      getJobCounts: jest.fn(),
      cacheErrorCount: 0
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: QueueManager,
          useValue: queueManager
        }
      ],
      controllers: [QueueManagerController]
    }).compile()

    controller = module.get<QueueManagerController>(QueueManagerController)
  })

  it('should return queue info with job counts', async () => {
    const counts = { active: 1, waiting: 0, completed: 5, failed: 0, delayed: 0 }
    ;(queueManager.getJobCounts as jest.Mock).mockResolvedValue(counts)

    const result = await controller.getJobCounts()

    expect(result).toEqual({
      total: 1,
      cacheErrors: 0,
      queues: {
        'provider.results': { jobCounts: counts }
      }
    })
  })

  it('should return null job counts when Redis is unavailable', async () => {
    ;(queueManager.getJobCounts as jest.Mock).mockResolvedValue(null)
    Object.defineProperty(queueManager, 'cacheErrorCount', { value: 3 })

    const result = await controller.getJobCounts()

    expect(result).toEqual({
      total: 1,
      cacheErrors: 3,
      queues: {
        'provider.results': { jobCounts: null }
      }
    })
  })
})
