import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SurveyComponentComponent } from './survey-component.component';

describe('SurveyComponentComponent', () => {
  let component: SurveyComponentComponent;
  let fixture: ComponentFixture<SurveyComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SurveyComponentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SurveyComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
