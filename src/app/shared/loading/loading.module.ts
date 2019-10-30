import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LoadingBarModule } from '@ngx-loading-bar/core';

import { LoadingComponent } from './loading.component';

@NgModule({
  declarations: [
    LoadingComponent,
  ],
  imports: [
    CommonModule,
    LoadingBarModule,
  ],
  exports: [
    LoadingComponent,
  ],
})
export class LoadingModule {
}
