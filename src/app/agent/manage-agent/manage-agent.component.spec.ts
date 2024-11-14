import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageAgentComponent } from './manage-agent.component';

describe('ManageAgentComponent', () => {
  let component: ManageAgentComponent;
  let fixture: ComponentFixture<ManageAgentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageAgentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageAgentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
