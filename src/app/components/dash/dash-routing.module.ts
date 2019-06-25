import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashComponent } from '@app/components/dash/dash.component';

const routes: Routes = [{
  path: '',
  component: DashComponent,
  children: [{
    path: 'team',
    loadChildren: './team/team.module#TeamModule'
  }]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashRoutingModule {
}
