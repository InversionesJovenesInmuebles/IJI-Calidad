import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPropertyHouseComponent } from './view-property-house.component';

describe('ViewPropertyHouseComponent', () => {
  let component: ViewPropertyHouseComponent;
  let fixture: ComponentFixture<ViewPropertyHouseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewPropertyHouseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewPropertyHouseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
