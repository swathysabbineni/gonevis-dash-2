import { HttpRequest } from '@angular/common/http';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { ErrorHandler } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, ActivatedRoute } from '@angular/router';
import { AppModule } from '@app/app.module';
import { DashModule } from '@app/components/dash/dash.module';
import { EntryComponent } from '@app/components/dash/entry/entry.component';
import { EntryModule } from '@app/components/dash/entry/entry.module';
import { EntryStatus } from '@app/enums/entry-status.enum';
import { Order } from '@app/enums/order';
import { Filter } from '@app/interfaces/filter';
import { Sort } from '@app/interfaces/sort';
import { Entry } from '@app/interfaces/v1/entry';
import { BlogService } from '@app/services/blog/blog.service';

describe('EntryComponent', () => {
  let httpMock: HttpTestingController;
  let component: EntryComponent;
  let fixture: ComponentFixture<EntryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppModule, DashModule, HttpClientTestingModule, EntryModule],
      providers: [{
        provide: ActivatedRoute,
        useValue: {
          snapshot: {
            data: {
              pages: true,
            },
          },
        },
      }],
    }).compileComponents();
  }));

  beforeEach(() => {
    spyOnProperty(BlogService, 'currentBlog', 'get').and.returnValue({
      id: '1',
    });
    httpMock = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(EntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.pagination.currentPage).toBe(1);
    const request = httpMock.expectOne((req: HttpRequest<Entry>): boolean => req.url.includes('site/1/entry'));
    expect(request.request.method).toBe('GET');
    expect(request.request.params.get('is_page')).toBeTruthy();
    request.flush({
      count: 0,
      next: null,
      previous: null,
      results: [],
    });
    expect(component.pagination.totalItems).toBe(0);
    expect(component.loading).toBeFalsy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load pages', () => {
    expect(component.isPages).toBeTruthy();
  });

  it('should toggle ordering', () => {
    expect(component.sortOrder).toBe(Order.ASCENDING);
    component.sortField = component.sortFields.find((sort: Sort): boolean => sort.value === 'view_count');
    component.toggleOrder();
    const request = httpMock.expectOne((req: HttpRequest<Entry>): boolean => req.url.includes('site/1/entry'));
    expect(request.request.method).toBe('GET');
    expect(request.request.params.get('ordering')).toEqual('-view_count');
    expect(component.sortOrder).toBe(Order.DESCENDING);
  });

  it('should get list of entries with filters', () => {
    component.search = 'simple search';
    component.statusFilter = component.statusFilters
      .find((status: Filter<EntryStatus>): boolean => status.value === EntryStatus.Draft);
    component.getEntries();
    const request = httpMock.expectOne((req: HttpRequest<Entry>): boolean => req.url.includes('site/1/entry'));
    expect(request.request.method).toBe('GET');
    expect(request.request.params.get('search')).toEqual('simple search');
    expect(request.request.params.get('status').toString()).toEqual(EntryStatus.Draft.toString());
    request.flush({
      count: 0,
      next: null,
      previous: null,
      results: [],
    });
    expect(component.pagination.totalItems).toBe(0);
    expect(component.loading).toBeFalsy();
  });
});
