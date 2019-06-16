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
    loadChildren: './reader/reader.module#ReaderModule',
    data: {
      route: 'explore',
      title: 'EXPLORE',
    },
  }, {
    path: 'updates',
    loadChildren: './reader/reader.module#ReaderModule',
    data: {
      route: 'updates',
      title: 'UPDATES',
    },
  }, {
    path: 'bookmarks',
    loadChildren: './reader/reader.module#ReaderModule',
    data: {
      route: 'bookmarks',
      title: 'BOOKMARKS',
    },
  }, {
    path: 'entry/:entryId',
    loadChildren: './entry/entry.module#EntryModule',
  }, {
    path: 'blog/:blogId',
    loadChildren: './blog/blog.module#BlogModule',
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
