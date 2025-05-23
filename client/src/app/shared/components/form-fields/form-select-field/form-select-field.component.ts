import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, input, Output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-form-select-field',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form-select-field.component.html',
  styleUrl: './form-select-field.component.css',
})
export class FormSelectFieldComponent {
  @Input() label: string | null = null;
  @Input() placeholder: string = 'Enter input';
  @Input() optionIdentifier: string | null = null;
  @Input() trackKey: string | null = null;
  @Output() inputChangeEvent = new EventEmitter();

  //Signal input types
  formControlInput = input.required<FormControl>();
  isRequired = input<boolean>(false);
  isDisabled = input<boolean>();
  options = input<any[]>([]);

  trackByFn(index: number, option: any) {
    return this.trackKey ? option[this.trackKey] : index;
  }

  onInputChange() {
    this.inputChangeEvent.emit();
  }

  getMessage(): string {
    if (this.formControlInput().hasError('valid')) {
      return `${this.label ?? 'Field'} is required`;
    }

    if (this.formControlInput().hasError('required')) {
      return `${this.label ?? 'Field'} is required`;
    }

    return `${this.label ?? 'Field'} is required`;
  }

  get showError() {
    return this.formControlInput().invalid && this.formControlInput().touched;
  }
}
