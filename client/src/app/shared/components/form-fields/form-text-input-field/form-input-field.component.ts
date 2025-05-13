import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
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
  label = input<string | null>(null);
  type = input<string>('text');
  placeholder = input<string>('Enter input');
}
