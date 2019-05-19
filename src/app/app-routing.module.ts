import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [{
  path: 'blog',
  loadChildren: './components/blog/blog.module#BlogModule'
}, {
  path: 'feed',
  loadChildren: './components/feed/feed.module#FeedModule'
}, {
  path: 'user',
  loadChildren: './components/user/user.module#UserModule'
}, {
  path: 'sign-in',
  loadChildren: './components/sign-in/sign-in.module#SignInModule'
}, {
  path: '**',
  redirectTo: 'feed',
  pathMatch: 'full'
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
