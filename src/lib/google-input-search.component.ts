/// <reference types="@types/googlemaps" />

import {
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';

import {
  fromEvent,
  Subscription,
  timer
} from 'rxjs';

import {
  debounce,
  distinctUntilChanged,
  filter,
  finalize,
  map,
} from 'rxjs/operators';

import {GoogleSearchService} from './google-search.service';

import QueryAutocompletePrediction = google.maps.places.QueryAutocompletePrediction;

@Component({
  selector: 'lib-google-input-search',
  template: `
    <input
      #inputSearch
      type="text"
      class="google-input"
      [placeholder]="placeholder">
  `,
  styleUrls: [
    './google-input-search.component.scss'
  ]
})
export class GoogleInputSearchComponent implements OnInit, OnDestroy {
  /**
   * Ref input element
   */
  @ViewChild('inputSearch', { static: true })
  searchElement: ElementRef<HTMLInputElement>;

  /**
   * Host class by default is true
   * If you want to disable the default styles set to false
   */
  @Input()
  @HostBinding('class.google-input-search')
  hostClass = true;

  /**
   * Placeholder input element
   */
  @Input()
  placeholder = '';

  /**
   * Time debounce to search
   */
  @Input()
  debounceTime = 450;

  /**
   * Channel to broadcast the input event of the search field
   */
  @Output()
  searchInput = new EventEmitter<string>();

  /**
   * Channel for charge status emission.
   * If true, a search is being performed for the first time
   * If it is false the search has finished
   */
  @Output()
  searchLoading = new EventEmitter<boolean>();

  /**
   * Channel for broadcasting results found
   */
  @Output()
  searchResult = new EventEmitter<QueryAutocompletePrediction[]>();

  /**
   * component subscriptions store
   */
  private subscriptions = new Subscription();

  constructor(
    private googleService: GoogleSearchService
  ) { }

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
  private watchInputEvents() {
    const inputEvent$ = fromEvent(this.searchElement.nativeElement, 'input').pipe(
      map((evt) => (evt.target as HTMLTextAreaElement).value),
    );

    this.subscriptions.add(
      inputEvent$.pipe(
        map(value => value.trim()),
        filter(value => Boolean(value)),
        debounce(() => timer(this.debounceTime)),
        distinctUntilChanged(),
      ).subscribe(value => this.queryPredictions(value))
    );
  }

  /**
   * Communication manager with search service
   */
  private queryPredictions(input: string) {
    this.searchLoading.emit(true);

    const searchObs$ = this.googleService.getQuery(input).pipe(
      finalize(() => {
        this.searchLoading.emit(false);
      })
    ).subscribe((predictions) => {
      console.log(predictions);
      this.searchResult.emit(predictions);
    });

    this.subscriptions.add(searchObs$);
  }

}
