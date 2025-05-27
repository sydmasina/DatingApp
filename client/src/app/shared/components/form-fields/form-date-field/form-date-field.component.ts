import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  Input,
  OnInit,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-form-date-field',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatDatepickerModule,
    MatDatepickerModule,
    ReactiveFormsModule,
  ],
  templateUrl: './form-date-field.component.html',
  styleUrl: './form-date-field.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormDateFieldComponent implements OnInit {
  @Input() label: string | null = null;
  @Input() minDate: Date | null = null;
  @Input() maxDate: Date | null = null;
  @Input() placeholderInput: string = 'Choose a date';
  @Input() id?: string;
  generatedId = '';

  //Signal input types
  formControlInput = input.required<FormControl>();
  isRequired = input<boolean>(false);
  isDisabled = input<boolean>();

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
