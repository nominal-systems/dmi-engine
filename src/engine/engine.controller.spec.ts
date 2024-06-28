import { Test, type TestingModule } from '@nestjs/testing'
import { EngineController } from './engine.controller'
import { QueueModuleService } from '../queue/queue-module.service'

describe('EngineController', () => {
  let controller: EngineController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: QueueModuleService,
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
