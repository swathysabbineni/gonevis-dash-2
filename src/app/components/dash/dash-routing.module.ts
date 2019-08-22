import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashComponent } from './dash.component';

const routes: Routes = [{
  path: '',
  component: DashComponent,
  data: {
    title: 'Dash',
  },
  children: [{
    path: '',
    redirectTo: 'main',
  }, {
    path: 'main',
    loadChildren: () => import('./main/main.module').then(m => m.MainModule),
  }, {
    path: 'write',
    loadChildren: () => import('./write/write.module').then(m => m.WriteModule),
  }, {
    path: 'posts',
    loadChildren: () => import('./entry/entry.module').then(m => m.EntryModule),
  }, {
    path: 'pages',
    data: {
      pages: true,
    },
    loadChildren: () => import('./entry/entry.module').then(m => m.EntryModule),
  }, {
    path: 'comments',
    loadChildren: () => import('./comments/comments.module').then(m => m.CommentsModule),
  }, {
    path: 'tags',
    loadChildren: () => import('./tags/tags.module').then(m => m.TagsModule),
  }, {
    path: 'media',
    loadChildren: () => import('./media/media.module').then(m => m.MediaModule),
  }, {
    path: 'navs',
    loadChildren: () => import('./navs/navs.module').then(m => m.NavsModule),
  }, {
    path: 'team',
    loadChildren: () => import('./team/team.module').then(m => m.TeamModule),
  }, {
    path: 'settings',
    loadChildren: () => import('./settings/settings.module').then(m => m.SettingsModule),
  }],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashRoutingModule {
}
