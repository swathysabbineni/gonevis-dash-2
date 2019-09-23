import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from '@app/services/auth-guard/auth-guard.service';

const routes: Routes = [{
  path: 'dash',
  children: [{
    path: ':blog',
    loadChildren: () => import('./components/dash/dash.module').then(m => m.DashModule),
  }, {
    path: '**',
    redirectTo: '0',
    pathMatch: 'full',
  }],
  canLoad: [AuthGuardService],
}, {
  path: 'feed',
  loadChildren: () => import('./components/feed/feed.module').then(m => m.FeedModule),
  canLoad: [AuthGuardService],
}, {
  path: 'user',
  loadChildren: () => import('./components/user/user.module').then(m => m.UserModule),
}, {
  path: 'start',
  loadChildren: () => import('./components/start/start.module').then(m => m.StartModule),
}, {
  path: '**',
  redirectTo: 'feed',
  pathMatch: 'full',
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
