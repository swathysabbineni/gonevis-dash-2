import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EntryShareComponent } from './entry-share.component';

describe('EntryShareComponent', () => {
  let component: EntryShareComponent;
  let fixture: ComponentFixture<EntryShareComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EntryShareComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EntryShareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
