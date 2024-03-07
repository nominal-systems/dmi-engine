import { MqttContext } from '@nestjs/microservices'

export class MqttContextMock extends MqttContext {
  constructor(private readonly topic: string) {
    super([topic, []])
  }

  getTopic(): string {
    return this.topic
  }
}
