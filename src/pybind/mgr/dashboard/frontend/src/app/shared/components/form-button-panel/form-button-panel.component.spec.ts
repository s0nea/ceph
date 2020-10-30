import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormButtonPanelComponent } from './form-button-panel.component';

describe('FormButtonPanelComponent', () => {
  let component: FormButtonPanelComponent;
  let fixture: ComponentFixture<FormButtonPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FormButtonPanelComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormButtonPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
