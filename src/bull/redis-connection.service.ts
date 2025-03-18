import { Injectable, Logger, OnModuleInit } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import Redis, { Cluster, ClusterOptions, RedisOptions } from 'ioredis'
import { BehaviorSubject, firstValueFrom } from 'rxjs'
import { filter, timeout } from 'rxjs/operators'

/**
 * Interface for Redis cluster node configuration
 */
interface RedisNodeOptions {
  host: string
  port: number
}

/**
 * Service responsible for establishing and monitoring Redis connection
 * before queues are registered. Supports both standalone Redis and Redis Cluster.
 */
@Injectable()
export class RedisConnectionService implements OnModuleInit {
  private readonly logger = new Logger(RedisConnectionService.name)
  private redisClient: Redis | Cluster | null = null
  private connectionAttempts = 0
  private readonly MAX_INITIAL_ATTEMPTS = 10
  private readonly INITIAL_ATTEMPT_DELAY = 1000 // 1 second
  private isClusterMode = false

  // Observable that emits true when Redis is connected
  private readonly redisConnected$ = new BehaviorSubject<boolean>(false)

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit() {
    this.establishRedisConnection()
  }

  /**
   * Waits for Redis to be connected before proceeding.
   * @param timeoutMs Maximum time to wait in milliseconds before timing out
   * @returns A promise that resolves when Redis is connected
   */
  async waitForRedisConnection(timeoutMs = 30000): Promise<boolean> {
    this.logger.debug(`Waiting for Redis connection (timeout: ${timeoutMs}ms)...`)

    try {
      // If already connected, return immediately
      if (this.redisConnected$.getValue()) {
        this.logger.debug('Redis already connected')
        return true
      }

      // Otherwise wait for connection
      await firstValueFrom(
        this.redisConnected$.pipe(
          filter((connected) => connected),
          timeout(timeoutMs)
        )
      )

      this.logger.debug('Redis connection established, proceeding with queue registration')
      return true
    } catch (error) {
      if (error.name === 'TimeoutError') {
        this.logger.error(`Timed out waiting for Redis connection after ${timeoutMs}ms`)
      } else {
        this.logger.error(`Error waiting for Redis connection: ${error.message}`)
      }
      return false
    }
  }

  /**
   * Check if Redis is currently connected
   */
  isConnected(): boolean {
    return this.redisConnected$.getValue()
  }

  /**
   * Check if Redis is running in cluster mode
   */
  isCluster(): boolean {
    return this.isClusterMode
  }

  /**
   * Get the Redis client instance (if connected)
   * @returns The Redis client or null if not connected
   */
  getRedisClient(): Redis | Cluster | null {
    return this.redisClient
  }

  /**
   * Establishes connection to Redis and keeps trying on failure
   */
  private establishRedisConnection() {
    const redisConfig = this.configService.get('redis')
    this.connectionAttempts++

    this.logger.debug(`Establishing Redis connection (attempt ${this.connectionAttempts})...`)

    try {
      // Close any existing connection
      if (this.redisClient !== null) {
        try {
          this.redisClient.disconnect()
        } catch (e) {
          // Ignore
        }
      }

      // Determine if we need to connect to a Redis cluster
      if (this.isRedisClusterConfig(redisConfig)) {
        this.connectToRedisCluster(redisConfig)
      } else {
        this.connectToStandaloneRedis(redisConfig)
      }
    } catch (err) {
      this.logger.error(`Failed to create Redis client: ${err.message}`, err.stack)

      // Try again if we're still in the initial connection phase
      if (this.connectionAttempts < this.MAX_INITIAL_ATTEMPTS) {
        this.logger.debug(`Scheduling another Redis connection attempt in ${this.INITIAL_ATTEMPT_DELAY}ms...`)
        setTimeout(() => {
          this.establishRedisConnection()
        }, this.INITIAL_ATTEMPT_DELAY)
      }
    }
  }

  /**
   * Connect to a standalone Redis server
   */
  private connectToStandaloneRedis(redisConfig: any) {
    // Construct connection URL for logging
    const redisHost = typeof redisConfig.host === 'string' ? redisConfig.host : 'localhost'
    const redisPort = typeof redisConfig.port === 'number' ? redisConfig.port : 6379
    const redisDB = typeof redisConfig.db === 'number' ? redisConfig.db : 0

    const connectionUrl = `redis://${redisHost}:${redisPort}/${redisDB}`
    this.logger.debug(`Connecting to standalone Redis at: ${connectionUrl}`)
    this.isClusterMode = false

    // Create new connection with retry strategy
    this.redisClient = new Redis({
      ...(redisConfig as RedisOptions),
      retryStrategy: (times) => {
        const delay = Math.min(times * 500, 5000) // 500ms, 1000ms, 1500ms, ... up to 5000ms
        this.logger.debug(`Redis connection failed, retrying in ${delay}ms (attempt ${times})`)
        return delay
      }
    })

    this.attachRedisEventListeners(this.redisClient, 'standalone')
  }

  /**
   * Connect to a Redis cluster
   */
  private connectToRedisCluster(redisConfig: any) {
    const { cluster, nodes, password, redisOptions, clusterOptions, ...otherOptions } = redisConfig

    // Get cluster nodes configuration
    let clusterNodes: RedisNodeOptions[] = []

    if (Array.isArray(cluster)) {
      clusterNodes = cluster as RedisNodeOptions[]
    } else if (Array.isArray(nodes)) {
      clusterNodes = nodes as RedisNodeOptions[]
    }

    if (clusterNodes.length === 0) {
      throw new Error('Redis cluster configuration is invalid: no nodes specified')
    }

    this.logger.debug(`Connecting to Redis cluster with ${clusterNodes.length} nodes:`)
    clusterNodes.forEach((node, index) => {
      this.logger.debug(`  Node ${index + 1}: ${node.host}:${node.port}`)
    })

    this.isClusterMode = true

    // Create Redis cluster client with proper options
    this.redisClient = new Redis.Cluster(clusterNodes, {
      ...(clusterOptions as ClusterOptions),
      redisOptions: {
        password,
        ...redisOptions,
        ...otherOptions,
        retryStrategy: (times) => {
          const delay = Math.min(times * 500, 5000)
          this.logger.debug(`Redis cluster connection failed, retrying in ${delay}ms (attempt ${times})`)
          return delay
        }
      },
      clusterRetryStrategy: (times) => {
        const delay = Math.min(times * 1000, 5000)
        this.logger.debug(`Redis cluster topology refresh failed, retrying in ${delay}ms (attempt ${times})`)
        return delay
      }
    })

    this.attachRedisEventListeners(this.redisClient, 'cluster')
  }

  /**
   * Attach Redis event listeners to the client
   */
  private attachRedisEventListeners(client: Redis | Cluster, mode: string) {
    // Handle connection events
    client.on('connect', () => {
      this.logger.debug(`Redis ${mode} connection in progress...`)
    })

    client.on('ready', () => {
      this.logger.debug(`Redis ${mode} connection ready`)
      this.redisConnected$.next(true)

      // Perform a PING test to verify connectivity
      void this.performPingTest(client, mode)
    })

    client.on('error', (err) => {
      this.logger.error(`Redis ${mode} connection error: ${err.message}`, err.stack)
      // Only set to false if previously connected
      if (this.redisConnected$.getValue()) {
        this.redisConnected$.next(false)
      }
    })

    client.on('close', () => {
      this.logger.debug(`Redis ${mode} connection closed`)
      this.redisConnected$.next(false)
    })

    client.on('reconnecting', (delay) => {
      this.logger.debug(`Redis ${mode} reconnecting in ${delay}ms...`)
    })

    client.on('end', () => {
      this.logger.debug(`Redis ${mode} connection ended`)
      this.redisConnected$.next(false)
    })

    // Cluster-specific events
    if (mode === 'cluster' && client instanceof Redis.Cluster) {
      client.on('+node', (node) => {
        this.logger.debug(`Redis cluster: node added ${node.options.host}:${node.options.port}`)
      })

      client.on('-node', (node) => {
        this.logger.debug(`Redis cluster: node removed ${node.options.host}:${node.options.port}`)
      })

      client.on('node error', (error, node) => {
        this.logger.error(`Redis cluster: node error on ${node.options.host}:${node.options.port}: ${error.message}`)
      })
    }
  }

  /**
   * Performs a PING test to verify Redis connectivity
   */
  private async performPingTest(client: Redis | Cluster, mode: string): Promise<void> {
    try {
      const pingResult = await client.ping()
      this.logger.debug(`Redis ${mode} PING test result: ${pingResult}`)
    } catch (error) {
      this.logger.error(`Redis ${mode} PING test failed: ${error.message}`)
    }
  }

  /**
   * Determines if the Redis configuration is for a cluster
   */
  private isRedisClusterConfig(redisConfig: any): boolean {
    // Check for explicit cluster configuration
    if (
      typeof redisConfig === 'object' &&
      redisConfig !== null &&
      typeof redisConfig.cluster !== 'undefined' &&
      (Array.isArray(redisConfig.cluster) || typeof redisConfig.cluster === 'object')
    ) {
      return true
    }

    // Check for nodes array
    if (
      typeof redisConfig === 'object' &&
      redisConfig !== null &&
      typeof redisConfig.nodes !== 'undefined' &&
      Array.isArray(redisConfig.nodes) &&
      redisConfig.nodes.length > 0
    ) {
      return true
    }

    return false
  }
}
