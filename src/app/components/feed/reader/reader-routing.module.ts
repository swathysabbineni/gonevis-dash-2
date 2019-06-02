import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReaderComponent } from '@app/components/feed/reader/reader.component';

const routes: Routes = [{
  path: '',
  component: ReaderComponent,
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReaderRoutingModule {
}
