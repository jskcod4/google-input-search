import { NgModule } from '@angular/core';

import { GoogleInputSearchComponent } from './google-input-search.component';
import { GoogleSearchDirective } from './google-search.directive';


@NgModule({
  declarations: [
    GoogleInputSearchComponent,
    GoogleSearchDirective
  ],
  imports: [
  ],
  exports: [
    GoogleInputSearchComponent,
    GoogleSearchDirective
  ]
})
export class GoogleInputSearchModule { }
