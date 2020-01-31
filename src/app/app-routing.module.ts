import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashGuardService } from '@app/components/dash/dash-guard.service';
import { AuthGuardService } from '@app/services/auth-guard/auth-guard.service';

const routes: Routes = [{
  path: 'dash',
  children: [{
    path: ':blog',
    loadChildren: () => import('./components/dash/dash.module').then(m => m.DashModule),
    canLoad: [AuthGuardService, DashGuardService],
    canActivate: [AuthGuardService]
  }, {
    path: '**',
    redirectTo: '0',
    pathMatch: 'full',
  }],
}, {
  path: 'feed',
  loadChildren: () => import('./components/feed/feed.module').then(m => m.FeedModule),
  canLoad: [AuthGuardService],
  canActivate: [AuthGuardService]
}, {
  path: 'user',
  loadChildren: () => import('./components/user/user.module').then(m => m.UserModule),
}, {
  path: 'start',
  redirectTo: 'user/start',
  pathMatch: 'full',
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuardService],
})
export class AppRoutingModule {
}
