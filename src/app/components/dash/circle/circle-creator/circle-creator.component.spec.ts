import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CircleCreatorComponent } from './circle-creator.component';

describe('CircleCreatorComponent', () => {
  let component: CircleCreatorComponent;
  let fixture: ComponentFixture<CircleCreatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CircleCreatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CircleCreatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
