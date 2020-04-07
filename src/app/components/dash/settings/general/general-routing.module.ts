import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GeneralComponent } from '@app/components/dash/settings/general/general.component';


const routes: Routes = [{
  path: '',
  component: GeneralComponent,
  data: {
    title: 'GENERAL',
  },
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GeneralRoutingModule {
}
