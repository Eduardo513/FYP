import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateStatisticsComponent } from './create-statistics.component';

describe('CreateStatisticsComponent', () => {
  let component: CreateStatisticsComponent;
  let fixture: ComponentFixture<CreateStatisticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateStatisticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
