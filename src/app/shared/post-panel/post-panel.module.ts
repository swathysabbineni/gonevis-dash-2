import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { PostPanelComponent } from './post-panel.component';

@NgModule({
  declarations: [
    PostPanelComponent,
  ],
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    ReactiveFormsModule,
    RouterModule,
  ],
  exports: [
    PostPanelComponent,
  ],
})
export class PostPanelModule {
}
