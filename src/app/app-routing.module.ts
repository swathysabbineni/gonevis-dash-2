import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [{
  path: 'feed',
  loadChildren: './components/feed/feed.module#FeedModule',
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
