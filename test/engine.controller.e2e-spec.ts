import { Test } from '@nestjs/testing'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { EngineController } from '../src/engine/engine.controller'

describe('EngineController', () => {
  beforeEach(async () => {
    const mockClient = {
      send: jest.fn().mockImplementation(() => ({
        toPromise: jest.fn().mockResolvedValueOnce({})
      }))
    }

    await Test.createTestingModule({
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
  })
})
