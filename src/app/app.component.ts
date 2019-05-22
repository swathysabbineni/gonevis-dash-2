import { Component } from '@angular/core';
import { UserAuth } from '@app/interfaces/user-auth';
import { AuthService } from '@app/services/auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'gonevis';
  isCollapsed: boolean;
  user: UserAuth;

  constructor(private authService: AuthService) {
    // Subscribe to AuthService's user changes.
    this.authService.user.subscribe((user: UserAuth): void => {
      this.user = user;
    });
    this.isCollapsed = true;
  }
}
