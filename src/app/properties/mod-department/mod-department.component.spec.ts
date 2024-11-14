import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModDepartmentComponent } from './mod-department.component';

describe('ModDepartmentComponent', () => {
  let component: ModDepartmentComponent;
  let fixture: ComponentFixture<ModDepartmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModDepartmentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModDepartmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
