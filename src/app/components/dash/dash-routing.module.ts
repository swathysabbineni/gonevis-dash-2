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
    path: 'main',
    loadChildren: () => import('./main/main.module').then(m => m.MainModule),
  }, {
    path: 'write',
    loadChildren: () => import('./write/write.module').then(m => m.WriteModule),
  }, {
    path: 'posts',
    loadChildren: () => import('./entry/entry.module').then(m => m.EntryModule),
    data: { title: 'POSTS' },
  }, {
    path: 'pages',
    loadChildren: () => import('./entry/entry.module').then(m => m.EntryModule),
    data: { title: 'PAGES', pages: true },
  }, {
    path: 'comments',
    loadChildren: () => import('./comments/comments.module').then(m => m.CommentsModule),
  }, {
    path: 'tags',
    loadChildren: () => import('./tags/tags.module').then(m => m.TagsModule),
  }, {
    path: 'statistics',
    loadChildren: () => import('./statistics/statistics.module').then(m => m.StatisticsModule),
  }, {
    path: 'media',
    loadChildren: () => import('./media/media.module').then(m => m.MediaModule),
  }, {
    path: 'navigation',
    loadChildren: () => import('./navigation/navigation.module').then(m => m.NavigationModule),
  }, {
    path: 'team',
    loadChildren: () => import('./team/team.module').then(m => m.TeamModule),
  }, {
    path: 'settings',
    loadChildren: () => import('./settings/settings.module').then(m => m.SettingsModule),
  }, {
    path: 'help',
    loadChildren: () => import('./help/help.module').then(m => m.HelpModule),
  }, {
    path: '**',
    pathMatch: 'full',
    redirectTo: 'main',
  }],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashRoutingModule {
}
