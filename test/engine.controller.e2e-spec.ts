import { Test, type TestingModule } from '@nestjs/testing'
import {
  type ClientProxy,
  ClientsModule,
  Transport
} from '@nestjs/microservices'
import { EngineController } from '../src/engine/engine.controller'

describe('EngineController', () => {
  let engineController: EngineController
  let client: ClientProxy

  beforeEach(async () => {
    const mockClient = {
      send: jest.fn().mockImplementation(() => ({
        toPromise: jest.fn().mockResolvedValueOnce({})
      }))
    }

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ClientsModule.register([
          {
            name: 'API_SERVICE',
            transport: Transport.MQTT,
            options: {
              url: 'mqtt://localhost:1883'
            }
          }
        ])
      ],
      controllers: [EngineController]
    })
      .overrideProvider('API_SERVICE')
      .useValue(mockClient)
      .compile()

    engineController = module.get<EngineController>(EngineController)
    client = module.get<ClientProxy>('API_SERVICE')
  })
})
