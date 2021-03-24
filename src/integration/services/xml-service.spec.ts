import { Test, TestingModule } from '@nestjs/testing'
import { XmlService } from './xml-service'

describe('XmlService', () => {
  let provider: XmlService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [XmlService]
    }).compile()

    provider = module.get<XmlService>(XmlService)
  })

  it('should be defined', () => {
    expect(provider).toBeDefined()
  })
})
