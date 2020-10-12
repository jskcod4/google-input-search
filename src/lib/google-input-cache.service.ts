import { Injectable } from '@angular/core';

import { Observable, of, Subject, throwError } from 'rxjs';

import { tap } from 'rxjs/operators';

import { CacheContent } from './google-input-search';

/**
 * Cache Service is an observables based in-memory cache implementation
 * Keeps track of in-flight observables and sets a default expiry for cached values
 * Source: https://hackernoon.com/angular-simple-in-memory-cache-service-on-the-ui-with-rxjs-77f167387e39
 */
@Injectable({
  providedIn: 'root',
})
export class CacheService {
  private cache: Map<string, CacheContent> = new Map<string, CacheContent>();
  private inFlightObservables: Map<string, Subject<any>> = new Map<
    string,
    Subject<any>
  >();
  readonly DEFAULT_MAX_AGE: number = 300000;

  /**
   * Gets the value from cache if the key is provided.
   * If no value exists in cache, then check if the same call exists
   * in flight, if so return the subject. If not create a new
   * Subject inFlightObservable and return the source observable.
   */
  get<T>(
    key: string,
    fallback?: Observable<T>,
    maxAge?: number
  ): Observable<T> | Subject<T> {
    if (this.hasValidCachedValue(key)) {
      const value = this.cache.get(key).value;
      return of(value);
    }

    if (!maxAge) {
      maxAge = this.DEFAULT_MAX_AGE;
    }

    if (this.inFlightObservables.has(key)) {
      return this.inFlightObservables.get(key);
    } else if (fallback && fallback instanceof Observable) {
      this.inFlightObservables.set(key, new Subject());
      return fallback.pipe(tap((value) => this.set(key, value, maxAge)));
    } else {
      return throwError('Requested key is not available in Cache');
    }
  }

  /**
   * Sets the value with key in the cache
   * Notifies all observers of the new value
   */
  set<T>(key: string, value: T, maxAge: number = this.DEFAULT_MAX_AGE): void {
    this.cache.set(key, {
      value: value,
      expiry: Date.now() + maxAge,
    });

    this.notifyInFlightObservers(key, value);
  }

  /**
   * Checks if the a key exists in cache
   */
  has(key: string): boolean {
    return this.cache.has(key);
  }

  /**
   * Publishes the value to all observers of the given
   * in progress observables if observers exist.
   */
  private notifyInFlightObservers<T>(key: string, value: T): void {
    if (this.inFlightObservables.has(key)) {
      const inFlight = this.inFlightObservables.get(key);
      const observersCount = inFlight.observers.length;
      if (observersCount) {
        inFlight.next(value);
      }
      inFlight.complete();
      this.inFlightObservables.delete(key);
    }
  }

  /**
   * Checks if the key exists and has not expired.
   */
  private hasValidCachedValue(key: string): boolean {
    if (this.cache.has(key)) {
      if (this.cache.get(key).expiry < Date.now()) {
        this.cache.delete(key);
        return false;
      }
      return true;
    } else {
      return false;
    }
  }
}
