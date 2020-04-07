import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdvancedComponent } from '@app/components/dash/settings/advanced/advanced.component';


const routes: Routes = [{
  path: '',
  component: AdvancedComponent,
  data: {
    title: 'ADVANCED',
  },
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdvancedRoutingModule {
}
