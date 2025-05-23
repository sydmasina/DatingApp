import { CommonModule } from '@angular/common';
import { Component, Input, input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-form-input-field',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './form-input-field.component.html',
  styleUrl: './form-input-field.component.css',
})
export class FormInputFieldComponent {
  formControlInput = input.required<FormControl>();
  isRequired = input<boolean>(false);
  @Input() label: string | null = null;
  @Input() type: string = 'text';
  @Input() placeholder: string = 'Enter input';
  @Input() rows: number = 6;

  getMessage(): string {
    if (this.formControlInput().hasError('valid')) {
      return `${this.label ?? 'Field'} is required`;
    }

    if (this.formControlInput().hasError('required')) {
      return `${this.label ?? 'Field'} is required`;
    }

    if (this.formControlInput().errors?.['passwordMismatch']) {
      return `Passwords do not match`;
    }

    return `${this.label ?? 'Field'} is required`;
  }

  get showError() {
    return this.formControlInput().invalid && this.formControlInput().touched;
  }
}
