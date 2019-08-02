import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FeedComponent } from './feed.component';

const routes: Routes = [{
  path: '',
  component: FeedComponent,
  data: {
    title: 'Feed',
  },
  children: [{
    path: 'explore',
    loadChildren: () => import('./reader/reader.module').then(m => m.ReaderModule),
    data: {
      route: 'explore',
      title: 'EXPLORE',
    },
  }, {
    path: 'updates',
    loadChildren: () => import('./reader/reader.module').then(m => m.ReaderModule),
    data: {
      route: 'updates',
      title: 'UPDATES',
    },
  }, {
    path: 'bookmarks',
    loadChildren: () => import('./reader/reader.module').then(m => m.ReaderModule),
    data: {
      route: 'bookmarks',
      title: 'BOOKMARKS',
    },
  }, {
    path: 'entry/:entryId',
    loadChildren: () => import('./entry/entry.module').then(m => m.EntryModule),
  }, {
    path: 'blog/:blogId',
    loadChildren: () => import('./blog/blog.module').then(m => m.BlogModule),
  }, {
    path: '',
    redirectTo: 'explore',
    pathMatch: 'full',
  }],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FeedRoutingModule {
}
