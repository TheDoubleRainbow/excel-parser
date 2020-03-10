import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FollowUpFlowComponent } from './follow-up-flow.component';

describe('FollowUpFlowComponent', () => {
  let component: FollowUpFlowComponent;
  let fixture: ComponentFixture<FollowUpFlowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FollowUpFlowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FollowUpFlowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
