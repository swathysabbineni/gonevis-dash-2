import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faDiscord } from '@fortawesome/free-brands-svg-icons/faDiscord';
import { faCheckCircle } from '@fortawesome/free-regular-svg-icons/faCheckCircle';
import { TranslateModule } from '@ngx-translate/core';

import { HelpRoutingModule } from './help-routing.module';
import { HelpComponent } from './help.component';


@NgModule({
  declarations: [
    HelpComponent,
  ],
  imports: [
    CommonModule,
    HelpRoutingModule,
    FontAwesomeModule,
    TranslateModule,
  ],
})
export class HelpModule {
  constructor() {
    library.add(faCheckCircle);
    library.add(faDiscord);
  }
}
