import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { InfoBannerComponent } from './info-banner.component';



@NgModule({
  declarations: [InfoBannerComponent],
  imports: [
    CommonModule,
    TranslateModule,
    FontAwesomeModule,
  ],
  exports: [
    InfoBannerComponent,
  ],
})
export class InfoBannerModule { }
