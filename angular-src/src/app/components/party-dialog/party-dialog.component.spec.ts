import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PartyDialogComponent } from './party-dialog.component';

describe('PartyDialogComponent', () => {
  let component: PartyDialogComponent;
  let fixture: ComponentFixture<PartyDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PartyDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartyDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
