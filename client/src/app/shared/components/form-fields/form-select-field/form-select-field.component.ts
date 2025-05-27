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
  selector: 'app-form-select-field',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form-select-field.component.html',
  styleUrl: './form-select-field.component.css',
})
export class FormSelectFieldComponent implements OnInit {
  @Input() label: string | null = null;
  @Input() placeholder: string = 'Enter input';
  @Input() optionIdentifier: string | null = null;
  @Input() trackKey: string | null = null;
  @Output() inputChangeEvent = new EventEmitter();
  @Input() id?: string;
  generatedId = '';

  //Signal input types
  formControlInput = input.required<FormControl>();
  isRequired = input<boolean>(false);
  isDisabled = input<boolean>();
  options = input<any[]>([]);

  ngOnInit(): void {
    this._initInputUniqueId();
  }
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

  private _initInputUniqueId() {
    this.generatedId =
      this.id || `input-${Math.random().toString(36).substr(2, 9)}`;
  }

  get uniqueId() {
    return this.generatedId;
  }

  get showError() {
    return this.formControlInput().invalid && this.formControlInput().touched;
  }
}
