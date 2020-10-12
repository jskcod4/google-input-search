/// <reference types="@types/googlemaps" />

import {
  Component,
  ElementRef,
  EventEmitter,
  OnDestroy,
  OnInit,
} from '@angular/core';

import { fromEvent, Subscription, timer } from 'rxjs';

import { debounce, distinctUntilChanged, finalize, map } from 'rxjs/operators';

import { GoogleSearchService } from './google-search.service';
import { GoogleInputSearch } from './google-input-search';

import QueryAutocompletePrediction = google.maps.places.QueryAutocompletePrediction;

@Component({
  selector: 'lib-google-input-search',
  template: `
    <input
      #inputSearch
      type="text"
      class="google-input"
      [placeholder]="placeholder"
    />
  `,
  styleUrls: ['./google-input-search.component.scss'],
})
export class GoogleInputSearchComponent
  extends GoogleInputSearch
  implements OnInit, OnDestroy {
  /**
   * Ref input element
   */
  searchElement: ElementRef<HTMLInputElement>;

  /**
   * Host class by default is true
   * If you want to disable the default styles set to false
   */
  hostClass = true;

  /**
   * Placeholder input element
   */
  placeholder = '';

  /**
   * Time debounce to search
   */
  debounceTime = 450;

  /**
   * Channel to broadcast the input event of the search field
   */
  searchInput = new EventEmitter<string>();

  /**
   * Channel for charge status emission.
   * If true, a search is being performed for the first time
   * If it is false the search has finished
   */
  searchLoading = new EventEmitter<boolean>();

  /**
   * Channel for broadcasting results found
   */
  searchResult = new EventEmitter<QueryAutocompletePrediction[]>();

  /**
   * Component subscriptions store
   */
  subscriptions = new Subscription();

  constructor(private googleService: GoogleSearchService) {
    super();
  }

  ngOnInit() {
    this.watchInputEvents();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  /**
   * Allows you to subscribe to the input event
   * And communicate with the service
   */
  watchInputEvents() {
    const inputEvent$ = fromEvent(
      this.searchElement.nativeElement,
      'input'
    ).pipe(map((evt) => (evt.target as HTMLTextAreaElement).value));

    this.subscriptions.add(
      inputEvent$
        .pipe(
          map((value) => value.trim()),
          debounce(() => timer(this.debounceTime)),
          distinctUntilChanged()
        )
        .subscribe((value) => this.queryPredictions(value))
    );
  }

  /**
   * Communication manager with search service
   */
  queryPredictions(query: string) {
    this.searchLoading.emit(true);

    const searchObs$ = this.googleService
      .getQuery(query)
      .pipe(
        finalize(() => {
          this.searchLoading.emit(false);
        })
      )
      .subscribe((predictions) => {
        this.searchResult.emit(predictions);
      });

    this.subscriptions.add(searchObs$);
  }
}
