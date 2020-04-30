import { HttpClient, HttpRequest } from '@angular/common/http';
import { HttpTestingController, HttpClientTestingModule, TestRequest } from '@angular/common/http/testing';
import { Component } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { AppModule } from '@app/app.module';
import { AuthInterceptorService } from '@app/services/auth-interceptor/auth-interceptor.service';
import { AuthService } from '@app/services/auth/auth.service';

describe('AuthInterceptorService', () => {
  let httpMock: HttpTestingController;
  let service: AuthInterceptorService;
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent],
      imports: [AppModule, HttpClientTestingModule],
    });
    httpMock = TestBed.inject(HttpTestingController);
    service = TestBed.inject(AuthInterceptorService);
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should prevent multiple invalid authentication modals from opening', () => {
    component.get();
    const request: TestRequest = httpMock.expectOne((req: HttpRequest<void>): boolean => req.url.includes('simple-url'));
    request.flush({ detail: 'Authentication credentials were not provided.' }, {
      status: 401,
      statusText: 'Unauthorized',
    });
    expect(AuthService.preventInvalidAuthenticationModal).toBeTrue();
  });
});

@Component({
  selector: 'app-test',
  template: '',
})
export class TestComponent {
  constructor(private http: HttpClient) {
  }

  get(): void {
    this.http.get('simple-url').subscribe();
  }
}
