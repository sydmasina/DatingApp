import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  input,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatSliderModule } from '@angular/material/slider';

@Component({
  selector: 'app-form-range-selector',
  standalone: true,
  imports: [CommonModule, MatSliderModule, ReactiveFormsModule],
  templateUrl: './form-range-selector.component.html',
  styleUrl: './form-range-selector.component.css',
})
export class FormRangeSelectorComponent implements OnInit {
  @Input() label: string | null = null;
  @Input() min: number = 18;
  @Input() max: number = 30;
  @Output() minInputChangeEvent = new EventEmitter();
  @Output() maxInputChangeEvent = new EventEmitter();
  @Input() id?: string;
  generatedId = '';

  //Signal input types
  minFormControl = input.required<FormControl>();
  maxFormControl = input.required<FormControl>();
  isRequired = input<boolean>(false);
  isDisabled = input<boolean>();

  ngOnInit(): void {
    this._initInputUniqueId();
  }

  private _initInputUniqueId() {
    this.generatedId =
      this.id || `input-${Math.random().toString(36).substr(2, 9)}`;
  }

  get uniqueId() {
    return this.generatedId;
  }
}
