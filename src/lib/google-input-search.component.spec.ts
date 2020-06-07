import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GoogleInputSearchComponent } from './google-input-search.component';

describe('GoogleInputSearchComponent', () => {
  let component: GoogleInputSearchComponent;
  let fixture: ComponentFixture<GoogleInputSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GoogleInputSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoogleInputSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
