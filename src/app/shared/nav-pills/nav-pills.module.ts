import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavPillsComponent } from '@app/shared/nav-pills/nav-pills.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [NavPillsComponent],
  imports: [
    CommonModule,
    RouterModule,
    FontAwesomeModule,
    TranslateModule.forChild(),
  ],
  exports: [NavPillsComponent],
})
export class NavPillsModule {
}
