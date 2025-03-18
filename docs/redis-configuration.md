# Redis Configuration

This application supports both standalone Redis and Redis Cluster configurations.

## Environment Variables

### Common Redis Settings

| Variable            | Description                       | Default             |
|---------------------|-----------------------------------|---------------------|
| `REDIS_PASSWORD`    | Password for Redis authentication | `""` (empty string) |
| `REDIS_TLS_ENABLED` | Enable TLS for Redis connections  | `false`             |

### Standalone Redis Settings

| Variable     | Description                                | Default     |
|--------------|--------------------------------------------|-------------|
| `REDIS_HOST` | Hostname or IP address of the Redis server | `localhost` |
| `REDIS_PORT` | Port number of the Redis server            | `6379`      |

### Redis Cluster Settings

| Variable                | Description                                                       | Default             |
|-------------------------|-------------------------------------------------------------------|---------------------|
| `REDIS_CLUSTER_ENABLED` | Enable Redis Cluster mode                                         | `false`             |
| `REDIS_CLUSTER_NODES`   | Comma-separated list of Redis Cluster nodes in `host:port` format | `""` (empty string) |

## Configuring Redis Cluster

To enable Redis Cluster mode, set `REDIS_CLUSTER_ENABLED=true` and provide the cluster nodes in `REDIS_CLUSTER_NODES`.

Example:

```env
REDIS_CLUSTER_ENABLED=true
REDIS_CLUSTER_NODES=redis-node1:6379,redis-node2:6379,redis-node3:6379
REDIS_PASSWORD=your-password
```

## Fallback Mechanism

If `REDIS_CLUSTER_ENABLED` is set to `true` but no valid nodes are provided in `REDIS_CLUSTER_NODES`, the application
will fall back to standalone mode using the `REDIS_HOST` and `REDIS_PORT` settings.

## Manual Configuration

For more advanced configurations, you can modify the `getRedisConfig()` function in `src/config/configuration.ts`.

## Programmatic Configuration

If you're configuring the application programmatically, you can provide either:

### Standalone Redis Configuration

```typescript
const redisConfig = {
  host: 'localhost',
  port: 6379,
  password: 'optional-password'
};
```

### Redis Cluster Configuration

```typescript
const redisConfig = {
  // Either provide nodes or cluster (both are supported)
  nodes: [
    { host: 'redis-node1', port: 6379 },
    { host: 'redis-node2', port: 6379 },
    { host: 'redis-node3', port: 6379 }
  ],
  password: 'optional-password',
  clusterOptions: {
    // Optional cluster-specific settings
    enableReadyCheck: true,
    slotsRefreshTimeout: 10000
  },
  redisOptions: {
    // Optional Redis client options applied to each node
    connectTimeout: 10000,
    tls: {} // Enable TLS
  }
};
``` 
