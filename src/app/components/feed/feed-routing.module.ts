import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FeedComponent } from './feed.component';

const routes: Routes = [{
  path: '',
  component: FeedComponent,
  data: {
    title: 'FEED',
  },
  children: [{
    path: 'explore',
    loadChildren: () => import('./reader/reader.module').then(m => m.ReaderModule),
    data: {
      route: 'explore',
      title: 'EXPLORE',
      showFilter: '',
    },
  }, {
    path: 'updates',
    loadChildren: () => import('./reader/reader.module').then(m => m.ReaderModule),
    data: {
      route: 'updates',
      title: 'UPDATES',
      showFilter: 'feed',
    },
  }, {
    path: 'bookmarks',
    loadChildren: () => import('./reader/reader.module').then(m => m.ReaderModule),
    data: {
      route: 'bookmarks',
      title: 'BOOKMARKS',
      showFilter: 'bookmarked',
    },
  }, {
    path: 'entry/:entryId',
    loadChildren: () => import('./entry/entry.module').then(m => m.EntryModule),
  }, {
    path: 'blog/:blogId',
    loadChildren: () => import('./blog/blog.module').then(m => m.BlogModule),
  }, {
    path: 'user/:username',
    loadChildren: () => import('./user/user.module').then(m => m.UserModule),
  }, {
    path: '**',
    redirectTo: 'updates',
    pathMatch: 'full',
  }],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FeedRoutingModule {
}
