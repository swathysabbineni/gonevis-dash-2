import { Component } from '@angular/core';
import { NavPill } from '@app/interfaces/nav-pill';
import { faLock } from '@fortawesome/free-solid-svg-icons/faLock';
import { faUser } from '@fortawesome/free-solid-svg-icons/faUser';

@Component({
  selector: 'app-user-setting',
  templateUrl: './user-setting.component.html',
  styleUrls: ['./user-setting.component.scss'],
})
export class UserSettingComponent {

  /**
   * Sidebar navigation
   */
  sidebarNavs: NavPill[] = [{
    label: 'PROFILE',
    route: 'profile',
    icon: faUser,
  }, {
    label: 'PASSWORD',
    route: 'password',
    icon: faLock,
  }];

  constructor() {
  }
}
