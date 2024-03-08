import { Test, type TestingModule } from '@nestjs/testing'
import { EngineController } from './engine.controller'
import { QueueService } from '../services/queue.service'

describe('EngineController', () => {
  let controller: EngineController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: QueueService,
          useValue: {}
        }
      ],
      controllers: [EngineController]
    }).compile()

    controller = module.get<EngineController>(EngineController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
