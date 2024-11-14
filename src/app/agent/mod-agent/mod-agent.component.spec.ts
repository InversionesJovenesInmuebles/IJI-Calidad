import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModAgentComponent } from './mod-agent.component';

describe('ModAgentComponent', () => {
  let component: ModAgentComponent;
  let fixture: ComponentFixture<ModAgentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModAgentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModAgentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
