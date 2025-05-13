import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  Input,
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
export class FormDateFieldComponent {
  @Input() label: string | null = null;
  @Input() minDate: Date | null = null;
  @Input() maxDate: Date | null = null;
  @Input() placeholderInput: string = 'Choose a date';

  //Signal input types
  formControlInput = input.required<FormControl>();
  isRequired = input<boolean>(false);
  isDisabled = input<boolean>();
}
