import { Directive, ElementRef, EventEmitter } from '@angular/core';

import { fromEvent, Subscription } from 'rxjs';

import { map, distinctUntilChanged } from 'rxjs/operators';

import { GoogleDirectiveSearch } from './google-input-search';

import { GoogleSearchService } from './google-search.service';

import QueryAutocompletePrediction = google.maps.places.QueryAutocompletePrediction;

@Directive({
  selector: '[libGoogleSearch], [googleSearch], [inputGoogleSearch]',
})
export class GoogleSearchDirective extends GoogleDirectiveSearch {
  /**
   * Ref input element
   */
  searchElement: ElementRef<HTMLInputElement>;

  /**
   * Channel for broadcasting results found
   */
  searchResult = new EventEmitter<QueryAutocompletePrediction[]>();

  /**
   * Component subscriptions store
   */
  subscriptions = new Subscription();

  constructor(
    public elementRef: ElementRef,
    public googleService: GoogleSearchService
  ) {
    super();
    this.searchElement = elementRef;
  }

  ngOnInit() {
    this.watchInputEvents();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  watchInputEvents() {
    const inputEvent$ = fromEvent(
      this.searchElement.nativeElement,
      'input'
    ).pipe(map((evt) => (evt.target as HTMLTextAreaElement).value));
    this.subscriptions.add(
      inputEvent$
        .pipe(
          map((value) => value.trim()),
          distinctUntilChanged()
        )
        .subscribe((value) => this.queryPredictions(value))
    );
  }

  queryPredictions(query: string) {
    this.subscriptions.add(
      this.googleService.getQuery(query).subscribe((predictions) => {
        this.searchResult.emit(predictions);
      })
    );
  }
}
