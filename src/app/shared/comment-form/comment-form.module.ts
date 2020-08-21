import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommentFormComponent } from '@app/shared/comment-form/comment-form.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { UserAvatarModule } from 'src/app/shared/user-avatar/user-avatar.module';

@NgModule({
  declarations: [CommentFormComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    TooltipModule.forRoot(),
    PopoverModule.forRoot(),
    TranslateModule.forChild(),
    UserAvatarModule,
  ],
  exports: [CommentFormComponent],
})
export class CommentFormModule {
}
