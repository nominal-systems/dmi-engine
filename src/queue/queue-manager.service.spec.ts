import { getQueueToken } from '@nestjs/bull'
import { ConfigService } from '@nestjs/config'
import { ModuleRef } from '@nestjs/core'
import { Test, type TestingModule } from '@nestjs/testing'
import { type EngineRole } from '@nominal-systems/dmi-engine-common'
import { QueueManager } from './queue-manager.service'

const QUEUE_NAMES = ['antech-v6.orders', 'antech-v6.results']
const DEFAULT_JOB_OPTIONS = { repeat: { every: 60000 } }
const QUEUE_INIT_TIMEOUT_MS = 30000

function reachableQueue(overrides: Record<string, unknown> = {}): any {
  return {
    getJobs: jest.fn().mockResolvedValue([]),
    getRepeatableJobs: jest.fn().mockResolvedValue([]),
    removeRepeatable: jest.fn().mockResolvedValue(undefined),
    add: jest.fn().mockResolvedValue(undefined),
    pause: jest.fn().mockResolvedValue(undefined),
    ...overrides
  }
}

function unreachableQueue(message: string): any {
  return reachableQueue({
    getJobs: jest.fn().mockRejectedValue(new Error(message))
  })
}

async function buildQueueManager(queues: Record<string, any>, role: EngineRole = 'all'): Promise<QueueManager> {
  const module: TestingModule = await Test.createTestingModule({
    providers: [
      QueueManager,
      { provide: 'QUEUE_NAMES', useValue: QUEUE_NAMES },
      { provide: 'JOB_OPTIONS', useValue: {} },
      {
        provide: ConfigService,
        useValue: {
          getOrThrow: jest.fn().mockReturnValue(DEFAULT_JOB_OPTIONS),
          get: jest.fn().mockReturnValue(role)
        }
      },
      {
        provide: ModuleRef,
        useValue: { get: jest.fn((token: string) => queues[token]) }
      }
    ]
  }).compile()

  return module.get<QueueManager>(QueueManager)
}

describe('QueueManager', () => {
  describe('onModuleInit', () => {
    it('registers every queue when they are all reachable', async () => {
      const queueManager = await buildQueueManager({
        [getQueueToken(QUEUE_NAMES[0])]: reachableQueue(),
        [getQueueToken(QUEUE_NAMES[1])]: reachableQueue()
      })

      await expect(queueManager.onModuleInit()).resolves.toBeUndefined()
      expect(queueManager.getQueueNames()).toEqual(QUEUE_NAMES)
    })

    it('refuses to start when a queue is unreachable', async () => {
      const queueManager = await buildQueueManager({
        [getQueueToken(QUEUE_NAMES[0])]: reachableQueue(),
        [getQueueToken(QUEUE_NAMES[1])]: unreachableQueue('getaddrinfo ENOTFOUND redis.example.net')
      })

      await expect(queueManager.onModuleInit()).rejects.toThrow(/Refusing to start: 1 of 2 queues/)
      await expect(queueManager.onModuleInit()).rejects.toThrow(/antech-v6\.results/)
      await expect(queueManager.onModuleInit()).rejects.toThrow(/ENOTFOUND/)
    })

    it('reports every failed queue, not just the first', async () => {
      const queueManager = await buildQueueManager({
        [getQueueToken(QUEUE_NAMES[0])]: unreachableQueue('Connection is closed'),
        [getQueueToken(QUEUE_NAMES[1])]: unreachableQueue('Connection is closed')
      })

      await expect(queueManager.onModuleInit()).rejects.toThrow(/2 of 2 queues/)
      await expect(queueManager.onModuleInit()).rejects.toThrow(/antech-v6\.orders/)
      await expect(queueManager.onModuleInit()).rejects.toThrow(/antech-v6\.results/)
    })

    it('pauses queues locally for the api role, and still fails when one is unreachable', async () => {
      const paused = reachableQueue()
      const queueManager = await buildQueueManager(
        {
          [getQueueToken(QUEUE_NAMES[0])]: paused,
          [getQueueToken(QUEUE_NAMES[1])]: reachableQueue()
        },
        'api'
      )

      await expect(queueManager.onModuleInit()).resolves.toBeUndefined()
      expect(paused.pause).toHaveBeenCalledWith(true)
    })

    it('treats a failed local pause as a queue initialization failure', async () => {
      const queueManager = await buildQueueManager(
        {
          [getQueueToken(QUEUE_NAMES[0])]: reachableQueue({
            pause: jest.fn().mockRejectedValue(new Error('Connection is closed'))
          }),
          [getQueueToken(QUEUE_NAMES[1])]: reachableQueue()
        },
        'api'
      )

      await expect(queueManager.onModuleInit()).rejects.toThrow(/Refusing to start: 1 of 2 queues/)
    })

    it('refuses to start when a queue never responds', async () => {
      // ioredis buffers commands in non-cluster mode, so an unreachable host leaves
      // the call pending forever rather than rejecting.
      jest.useFakeTimers()
      const queueManager = await buildQueueManager({
        [getQueueToken(QUEUE_NAMES[0])]: reachableQueue({
          getJobs: jest.fn().mockReturnValue(new Promise(() => {}))
        }),
        [getQueueToken(QUEUE_NAMES[1])]: reachableQueue()
      })

      // Attach the expectation before advancing timers so the rejection is handled.
      const assertion = expect(queueManager.onModuleInit()).rejects.toThrow(/timed out after 30000ms/)
      await jest.advanceTimersByTimeAsync(QUEUE_INIT_TIMEOUT_MS + 1000)
      await assertion

      jest.useRealTimers()
    })

    it('starts when only the repeat-interval reconciliation fails', async () => {
      // Queue is reachable, so the provider still gets polled — the stale interval
      // is a degraded state, not a reason to take the engine down.
      const staleJob = { opts: { repeat: { key: 'repeat-key', every: 30000 } }, data: {} }
      const queueWithStaleJob = reachableQueue({
        getJobs: jest.fn().mockResolvedValue([staleJob]),
        getRepeatableJobs: jest.fn().mockResolvedValue([{ id: 'integration-1', key: 'repeat-key', every: 30000 }]),
        removeRepeatable: jest.fn().mockRejectedValue(new Error('LOCK lost'))
      })
      const queueManager = await buildQueueManager({
        [getQueueToken(QUEUE_NAMES[0])]: queueWithStaleJob,
        [getQueueToken(QUEUE_NAMES[1])]: reachableQueue()
      })

      await expect(queueManager.onModuleInit()).resolves.toBeUndefined()
      expect(queueManager.getQueueNames()).toEqual(QUEUE_NAMES)
    })
  })
})
