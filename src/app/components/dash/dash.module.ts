import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DashComponent } from '@app/components/dash/dash.component';
import { CommentsComponent } from './comments/comments.component';

import { DashRoutingModule } from './dash-routing.module';
import { MainComponent } from './main/main.component';
import { NavsComponent } from './navs/navs.component';
import { PagesComponent } from './pages/pages.component';
import { PostsComponent } from './posts/posts.component';
import { TagsComponent } from './tags/tags.component';
import { TeamComponent } from './team/team.component';

@NgModule({
  declarations: [
    DashComponent,
    TeamComponent,
    MainComponent,
    PostsComponent,
    PagesComponent,
    TagsComponent,
    CommentsComponent,
    NavsComponent,
  ],
  imports: [
    CommonModule,
    DashRoutingModule,
  ],
})
export class DashModule {
}
