import { HttpRequest } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { AppModule } from '@app/app.module';
import { DashModule } from '@app/components/dash/dash.module';
import { WriteComponent } from '@app/components/dash/write/write.component';
import { WriteModule } from '@app/components/dash/write/write.module';
import { ApiResponse } from '@app/interfaces/api-response';
import { Entry } from '@app/interfaces/v1/entry';
import { Tag } from '@app/interfaces/v1/tag';
import { BlogService } from '@app/services/blog/blog.service';
import { of } from 'rxjs';

describe('WriteComponent', () => {
  let httpMock: HttpTestingController;
  let component: WriteComponent;
  let fixture: ComponentFixture<WriteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppModule, DashModule, HttpClientTestingModule, WriteModule],
      providers: [{
        provide: ActivatedRoute,
        useValue: {
          params: of({ id: '123' }),
        },
      }],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    spyOnProperty(BlogService, 'currentBlog', 'get').and.returnValue({
      id: '1',
    });
    httpMock = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(WriteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.isEditing).toBeTrue();
    expect(component.tags).toEqual([]);
    const request: TestRequest = httpMock.expectOne(
      (req: HttpRequest<ApiResponse<Tag>>): boolean => req.url.includes('site/1/tagool/tag/'),
    );
    expect(request.request.method).toBe('GET');
    expect(request.request.params.get('search')).toBe('');
    request.flush({
      count: 2,
      next: null,
      previous: null,
      results: [{
        id: 'tag-1',
        name: 'tag 1',
        slug: 'tag-1-slug',
      }, {
        id: 'tag-2',
        name: 'tag 2',
        slug: 'tag-2-slug',
      }],
    });
    expect(component.tags.length).toEqual(2);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should add tags', () => {
    expect(component.form.get('tags').value).toEqual([]);
    component.addTag('tag-1-slug');
    expect(component.form.get('tags').value.includes('tag-1-slug')).toBeTrue();
    expect(component).toBeTruthy();
  });
});
