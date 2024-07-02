import { promisify } from 'util';
import { createClient } from 'redis';

/**
 * Reps a Redis client
 */
class RedisClient {
  /**
   * Creates new instance RedisClient
   */
  constructor() {
    this.client = createClient();
    this.isClientConnected = true;
    this.client.on('error', (err) => {
      console.error('Redis client failed to connect:', err.message || err.toString());
      this.isClientConnected = false;
    });
    this.client.on('connect', () => {
      this.isClientConnected = true;
    });
  }

  /**
   * Checks if client's connection to Redis server is active
   * @returns {boolean}
   */
  isAlive() {
    return this.isClientConnected;
  }

  /**
   * Recollects value of given key.
   * @param {String} directs key of the item to retrieve.
   * @returns {String | Object}
   */
  async get(key) {
    return promisify(this.client.GET).bind(this.client)(key);
  }

  /**
   * Stores key and its value along with an expiration time
   * @param {String} key The key of the item to store
   * @param {String | Number | Boolean} val item to store
   * @param {Number} duration expiration time of the item in seconds
   * @returns {Promise<void>}
   */
  async set(key, value, duration) {
    await promisify(this.client.SETEX)
      .bind(this.client)(key, duration, value);
  }

  /**
   * Removes value of a given key
   * @param {String} key The key of item to get rid of
   * @returns {Promise<void>}
   */
  async del(key) {
    await promisify(this.client.DEL).bind(this.client)(key);
  }
}

export const redisClient = new RedisClient();
export default redisClient;
