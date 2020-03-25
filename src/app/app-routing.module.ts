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
    canActivate: [AuthGuardService],
  }, {
    path: '**',
    redirectTo: '0',
    pathMatch: 'full',
  }],
}, {
  path: 'feed',
  loadChildren: () => import('./components/feed/feed.module').then(m => m.FeedModule),
  canLoad: [AuthGuardService],
  canActivate: [AuthGuardService],
}, {
  path: 'user',
  loadChildren: () => import('./components/user/user.module').then(m => m.UserModule),
}, {
  path: 'start',
  redirectTo: 'user/start',
  pathMatch: 'full',
}, {
  path: 'reset-password/:token',
  redirectTo: 'user/reset-password/:token',
  pathMatch: 'full',
}, {
  path: 'start-collaborating/:invite',
  redirectTo: 'user/start-collaborating/:invite',
  pathMatch: 'full',
}, {
  path: '',
  redirectTo: 'dash',
  pathMatch: 'full',
}, {
  path: '**',
  loadChildren: () => import('./components/page-not-found/page-not-found.module').then(m => m.PageNotFoundModule),
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuardService],
})
export class AppRoutingModule {
}
