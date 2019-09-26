import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faBars } from '@fortawesome/free-solid-svg-icons/faBars';
import { faCog } from '@fortawesome/free-solid-svg-icons/faCog';
import { faComments } from '@fortawesome/free-solid-svg-icons/faComments';
import { faHome } from '@fortawesome/free-solid-svg-icons/faHome';
import { faKeyboard } from '@fortawesome/free-solid-svg-icons/faKeyboard';
import { faNewspaper } from '@fortawesome/free-solid-svg-icons/faNewspaper';
import { faPhotoVideo } from '@fortawesome/free-solid-svg-icons/faPhotoVideo';
import { faQuestion } from '@fortawesome/free-solid-svg-icons/faQuestion';
import { faScroll } from '@fortawesome/free-solid-svg-icons/faScroll';
import { faTags } from '@fortawesome/free-solid-svg-icons/faTags';
import { faUsers } from '@fortawesome/free-solid-svg-icons/faUsers';

import { DashRoutingModule } from './dash-routing.module';
import { DashComponent } from './dash.component';

@NgModule({
  declarations: [
    DashComponent,
  ],
  imports: [
    CommonModule,
    DashRoutingModule,
    FontAwesomeModule,
  ],
})
export class DashModule {
  constructor() {
    library.add(faHome);
    library.add(faKeyboard);
    library.add(faNewspaper);
    library.add(faScroll);
    library.add(faComments);
    library.add(faTags);
    library.add(faPhotoVideo);
    library.add(faBars);
    library.add(faUsers);
    library.add(faCog);
    library.add(faQuestion);
  }
}
