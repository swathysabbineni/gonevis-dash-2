import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AutoResizeDirective } from '@app/shared/auto-resize/auto-resize.directive';


@NgModule({
  declarations: [AutoResizeDirective],
  imports: [
    CommonModule,
  ],
  exports: [AutoResizeDirective],
})
export class AutoResizeModule {
}
