import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  input,
  OnInit,
  Output,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-form-input-field',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './form-input-field.component.html',
  styleUrl: './form-input-field.component.css',
})
export class FormInputFieldComponent implements OnInit {
  formControlInput = input.required<FormControl>();
  isRequired = input<boolean>(false);
  @Input() label: string | null = null;
  @Input() type: string = 'text';
  @Input() placeholder: string = 'Enter input';
  @Input() rows: number = 6;
  @Input() id?: string;
  @Output() inputChangeEvent = new EventEmitter();
  generatedId = '';

  ngOnInit(): void {
    this._initInputUniqueId();
  }

  getMessage(): string {
    if (this.formControlInput().hasError('valid')) {
      return `${this.label ?? 'Field'} is required`;
    }

    if (this.formControlInput().hasError('required')) {
      return `${this.label ?? 'Field'} is required`;
    }

    if (this.formControlInput().hasError('minlength')) {
      return `${this.label ?? 'Field'} must be at least ${
        this.formControlInput().errors?.['minlength'].requiredLength
      } characters`;
    }

    if (this.formControlInput().hasError('maxlength')) {
      return `${this.label ?? 'Field'} must be not be more than ${
        this.formControlInput().errors?.['maxlength'].requiredLength
      } characters`;
    }

    if (this.formControlInput().errors?.['passwordMismatch']) {
      return `Passwords do not match`;
    }

    return `${this.label ?? 'Field'} is required`;
  }

  private _initInputUniqueId() {
    this.generatedId =
      this.id || `input-${Math.random().toString(36).substr(2, 9)}`;
  }

  get showError() {
    return this.formControlInput().invalid && this.formControlInput().touched;
  }

  get uniqueId() {
    return this.generatedId;
  }
}
