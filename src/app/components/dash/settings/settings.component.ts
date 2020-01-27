import { Component } from '@angular/core';
import { TeamRoles } from '@app/enums/team-roles';
import { BlogMin } from '@app/interfaces/zero/user/blog-min';
import { BlogService } from '@app/services/blog/blog.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent {

  /**
   * Page tabs
   * Tab names will be converted to uppercase and used as translation keys in view.
   */
  readonly tabs: string[] = [
    'general',
    'appearance',
    'advanced',
    'upgrade',
    'billing',
  ];

  /**
   * Determines whether or not the user's role in current blog is editor
   */
  isEditor: boolean = BlogService.currentBlog.role === TeamRoles.Editor;

  constructor() {
  }
}
