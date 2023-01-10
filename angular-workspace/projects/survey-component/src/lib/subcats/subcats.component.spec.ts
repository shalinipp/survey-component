import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubcatsComponent } from './subcats.component';

describe('SubcatsComponent', () => {
  let component: SubcatsComponent;
  let fixture: ComponentFixture<SubcatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubcatsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubcatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
