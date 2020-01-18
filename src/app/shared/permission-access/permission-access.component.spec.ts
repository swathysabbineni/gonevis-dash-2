import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PermissionAccessComponent } from './permission-access.component';

describe('PermissionAccessComponent', () => {
  let component: PermissionAccessComponent;
  let fixture: ComponentFixture<PermissionAccessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PermissionAccessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PermissionAccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
