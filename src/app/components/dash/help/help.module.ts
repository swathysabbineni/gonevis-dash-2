import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HelpRoutingModule } from '@app/components/dash/help/help-routing.module';
import { HelpComponent } from '@app/components/dash/help/help.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons/faCheckCircle';


@NgModule({
  declarations: [
    HelpComponent,
  ],
  imports: [
    CommonModule,
    HelpRoutingModule,
    FontAwesomeModule,
  ],
})
export class HelpModule {
  constructor() {
    library.add(faCheckCircle);
  }
}
