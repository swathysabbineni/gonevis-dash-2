import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from '@app/services/auth-guard/auth-guard.service';

const routes: Routes = [{
  path: 'feed',
  loadChildren: './components/feed/feed.module#FeedModule',
  canLoad: [AuthGuardService],
}, {
  path: 'user',
  loadChildren: './components/user/user.module#UserModule',
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
