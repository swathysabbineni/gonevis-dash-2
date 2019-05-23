import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [{
  path: 'blog',
  loadChildren: './components/blog/blog.module#BlogModule',
}, {
  path: 'feed',
  loadChildren: './components/feed/feed.module#FeedModule',
}, {
  path: 'user',
  loadChildren: './components/user/user.module#UserModule',
}, {
  path: 'sign-in',
  loadChildren: './components/sign-in/sign-in.module#SignInModule',
}, {
  path: 'sign-up',
  loadChildren: './components/sign-up/sign-up.module#SignUpModule',
}, {
  path: 'forgot-password',
  loadChildren: './components/forgot-password/forgot-password.module#ForgotPasswordModule',
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
