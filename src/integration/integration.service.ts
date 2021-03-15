import { Injectable } from '@nestjs/common';
import { ApiEvent } from './events/api-event';

@Injectable()
export class IntegrationService {
  async handleAsync(event: ApiEvent) {
    console.log('IntegrationService.handleAsync()'); // TODO(gb): Remove trace!!!
    // TODO(gb): implement event handling logic async
  }

  async handleSync(event: ApiEvent) {
    console.log('IntegrationService.handleSync()'); // TODO(gb): Remove trace!!!
    // TODO(gb): implement event handling logic sync
    return 'OK';
  }
}
