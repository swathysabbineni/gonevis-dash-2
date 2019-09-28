import { NgModule } from '@angular/core';
import { EmbedDirective } from '@app/shared/embed/embed.directive';


@NgModule({
  declarations: [EmbedDirective],
  exports: [EmbedDirective],
})
export class EmbedModule {
}
