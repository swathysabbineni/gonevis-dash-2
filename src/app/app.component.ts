import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Data, NavigationEnd, Router, RouterEvent } from '@angular/router';
import { UserAuth } from '@app/interfaces/user-auth';
import { AuthService } from '@app/services/auth/auth.service';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { filter, map, mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'gonevis';
  isCollapsed: boolean;
  user: UserAuth;

  constructor(public authService: AuthService,
              private translateService: TranslateService,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private titleService: Title) {
    this.translateService.setDefaultLang('en');
    // Subscribe to AuthService's user changes.
    this.authService.user.subscribe((user: UserAuth): void => {
      this.user = user;
    });
    this.isCollapsed = true;
    this.translateService.setDefaultLang('en');
    // Set window title
    this.router.events.pipe(
      filter((event: RouterEvent): boolean => event instanceof NavigationEnd),
      map((): ActivatedRoute => this.activatedRoute),
      map((route: ActivatedRoute): ActivatedRoute => {
        while (route.firstChild) {
          route = route.firstChild;
        }
        return route;
      }),
      filter((route: ActivatedRoute): boolean => route.outlet === 'primary'),
      mergeMap((route: ActivatedRoute): Observable<Data> => route.data),
    ).subscribe((event: Data): void => {
      this.translateService.get(event.title).subscribe((response: string): void => {
        this.titleService.setTitle(response);
      });
    });
  }
}
