import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPropertyDepartmentComponent } from './view-property-department.component';

describe('ViewPropertyDepartmentComponent', () => {
  let component: ViewPropertyDepartmentComponent;
  let fixture: ComponentFixture<ViewPropertyDepartmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewPropertyDepartmentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewPropertyDepartmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
