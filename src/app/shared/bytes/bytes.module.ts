import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BytesPipe } from '@app/shared/bytes/bytes.pipe';


@NgModule({
  declarations: [BytesPipe],
  exports: [BytesPipe],
  imports: [CommonModule],
})
export class BytesPipeModule {
}
