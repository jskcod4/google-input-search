import {Injectable} from '@angular/core';

import {Observable, Subject} from 'rxjs';
import {tap} from 'rxjs/operators';

import {CacheService} from './google-input-cache.service';

import QueryAutocompletePrediction = google.maps.places.QueryAutocompletePrediction;

/**
 * Google Search Service is a search implementation
 * Based on Google's Autocomplete Service
 */
@Injectable({
  providedIn: 'root'
})
export class GoogleSearchService {
  private service = new google.maps.places.AutocompleteService();

  constructor(
    private cacheService: CacheService
  ) {}

  /**
   * Get the prediction based on google's Autocomplete Service.
   * If the search is in memory, it returns directly from the Cache Service
   */
  getQuery(value: string): Observable<QueryAutocompletePrediction[]> {
    let obs$: Observable<QueryAutocompletePrediction[]>;
    if (this.cacheService.has(value)) {
      obs$ = this.cacheService.get(value, this.requestPrediction(value));
    } else if (!value && !value.trim()) {
      obs$ = new Observable<QueryAutocompletePrediction[]>(obs => {
        obs.next([]);
        obs.complete();
      })
    } else {
      obs$ = this.requestPrediction(value).pipe(
        tap((predictions) => {
          this.cacheService.set(value, predictions)
        })
      );
    }
    return obs$;
  }

  /**
   * Make the google getQueryPredictions() method observable
   */
  private requestPrediction(input: string): Observable<QueryAutocompletePrediction[]> {
    const obs$ = new Subject<QueryAutocompletePrediction[]>();
    this.service.getQueryPredictions({ input }, (predictions, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        obs$.next(predictions);
        obs$.complete();
      } else {
        obs$.error(null);
      }
    });
    return obs$.asObservable();
  }

}
