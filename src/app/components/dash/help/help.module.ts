import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
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
    TranslateModule.forChild(),
  ],
})
export class HelpModule {
}
