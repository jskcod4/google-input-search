import {
  EventEmitter,
  Output,
  ElementRef,
  ViewChild,
  Input,
  HostBinding,
} from '@angular/core';

import { Subscription } from 'rxjs';

import QueryAutocompletePrediction = google.maps.places.QueryAutocompletePrediction;

export interface CacheContent<T = any> {
  expiry: number;
  value: T;
}

export interface GoogleSearch {
  searchElement: ElementRef<HTMLInputElement>;
  searchResult: EventEmitter<QueryAutocompletePrediction[]>;
  subscriptions: Subscription;
  watchInputEvents: () => void;
  queryPredictions: (query: string) => void;
}

export abstract class GoogleInputSearch implements GoogleSearch {
  @ViewChild('inputSearch', { static: true })
  abstract searchElement: ElementRef<HTMLInputElement>;

  @Input()
  @HostBinding('class.google-input-search')
  abstract hostClass: boolean;

  @Input()
  abstract placeholder: string;

  @Input()
  abstract debounceTime: number;

  @Output()
  abstract searchResult: EventEmitter<QueryAutocompletePrediction[]>;

  @Output()
  abstract searchInput: EventEmitter<string>;

  @Output()
  abstract searchLoading: EventEmitter<boolean>;

  abstract subscriptions: Subscription;
  abstract watchInputEvents(): void;
  abstract queryPredictions(query: string): void;
}

export abstract class GoogleDirectiveSearch implements GoogleSearch {
  abstract searchElement: ElementRef<HTMLInputElement>;

  @Output()
  abstract searchResult: EventEmitter<QueryAutocompletePrediction[]>;

  abstract subscriptions: Subscription;
  abstract watchInputEvents(): void;
  abstract queryPredictions(query: string): void;
}
