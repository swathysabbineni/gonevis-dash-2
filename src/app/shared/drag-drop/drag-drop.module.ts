import { NgModule } from '@angular/core';
import { DragDropDirective } from '@app/shared/drag-drop/drag-drop.directive';


@NgModule({
  declarations: [DragDropDirective],
  exports: [DragDropDirective],
})
export class DragDropModule {
}
