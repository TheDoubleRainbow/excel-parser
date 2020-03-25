import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NluDiffCheckerComponent } from './nlu-diff-checker.component';

describe('NluDiffCheckerComponent', () => {
  let component: NluDiffCheckerComponent;
  let fixture: ComponentFixture<NluDiffCheckerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NluDiffCheckerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NluDiffCheckerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
