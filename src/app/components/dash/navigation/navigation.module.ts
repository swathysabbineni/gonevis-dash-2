import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LoadingModule } from '@app/shared/loading/loading.module';
import { PermissionAccessModule } from '@app/shared/permission-access/permission-access.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';

import { NavigationRoutingModule } from './navigation-routing.module';
import { NavigationComponent } from './navigation.component';

@NgModule({
  declarations: [
    NavigationComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    NavigationRoutingModule,
    TranslateModule.forChild(),
    FontAwesomeModule,
    FormsModule,
    DragDropModule,
    LoadingModule,
    PermissionAccessModule,
  ],
})
export class NavigationModule {
}
