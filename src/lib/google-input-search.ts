export interface CacheContent<T = any> {
  expiry: number;
  value: T;
}
