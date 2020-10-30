import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'cd-form-button-panel',
  templateUrl: './form-button-panel.component.html',
  styleUrls: ['./form-button-panel.component.scss']
})
export class FormButtonPanelComponent {
  @Output()
  submitActionEvent = new EventEmitter();
  @Input()
  formDir: NgForm;
  @Input()
  text: string;

  submitAction() {
    this.submitActionEvent.emit();
  }
}
