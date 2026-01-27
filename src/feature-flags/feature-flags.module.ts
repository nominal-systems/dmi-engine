import { Global, Module } from '@nestjs/common'
import { statsigFeatureFlagProvider, StatsigFeatureFlagsService } from './statsig-feature-flags.service'
import { StatsigHeartbeatService } from './statsig-heartbeat.service'

@Global()
@Module({
  providers: [StatsigFeatureFlagsService, statsigFeatureFlagProvider, StatsigHeartbeatService],
  exports: [StatsigFeatureFlagsService, statsigFeatureFlagProvider]
})
export class FeatureFlagsModule {}
