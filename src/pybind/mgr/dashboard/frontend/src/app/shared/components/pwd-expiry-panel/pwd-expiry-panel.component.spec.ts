import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PwdExpiryPanelComponent } from './pwd-expiry-panel.component';

describe('PwdExpiryPanelComponent', () => {
  let component: PwdExpiryPanelComponent;
  let fixture: ComponentFixture<PwdExpiryPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PwdExpiryPanelComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PwdExpiryPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
