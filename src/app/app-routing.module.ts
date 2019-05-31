import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [{
  path: 'blog',
  loadChildren: './components/blog/blog.module#BlogModule',
}, {
  path: 'feed',
  loadChildren: './components/feed/feed.module#FeedModule',
  data: {
    route: 'feed',
  },
}, {
  path: 'explore',
  loadChildren: './components/feed/feed.module#FeedModule',
  data: {
    route: 'explore',
  },
}, {
  path: 'bookmarks',
  loadChildren: './components/feed/feed.module#FeedModule',
  data: {
    route: 'bookmarks',
  },
}, {
  path: 'entry/:entryId',
  loadChildren: './components/entry/entry.module#EntryModule',
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
  path: 'reset-password/:token',
  loadChildren: './components/reset-password/reset-password.module#ResetPasswordModule',
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
