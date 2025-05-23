import { CommonModule } from '@angular/common';
import { Component, OnInit, output } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { FormInputFieldComponent } from '../../shared/components/form-fields/form-text-input-field/form-input-field.component';
import { Register } from '../../shared/models/register';
import { AuthService } from '../../shared/services/auth.service';
import { passwordMatchValidator } from '../../shared/utils/form-validator-functions';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormInputFieldComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent implements OnInit {
  cancelRegister = output<boolean>();
  registerFormGroup!: FormGroup;

  constructor(
    private authService: AuthService,
    private toastrService: ToastrService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this._initFormGroup();
  }

  private _initFormGroup() {
    this.registerFormGroup = this.formBuilder.group(
      {
        username: ['', [Validators.required]],
        password: ['', [Validators.required]],
        confirmPassword: ['', [Validators.required, passwordMatchValidator]],
      },
      { validators: passwordMatchValidator }
    );
  }

  register() {
    this.registerFormGroup.markAllAsTouched();

    if (this.registerFormGroup.errors?.['passwordMismatch']) {
      this.toastrService.error("Your passwords don't match.");
      return;
    }

    if (this.registerFormGroup.invalid) {
      this.toastrService.error(
        'Please provide username and password to proceed.'
      );
      return;
    }

    const registerPayload: Register = {
      username: this.usernameFormControl.value,
      password: this.passwordFormControl.value,
    };

    this.authService.register(registerPayload).subscribe({
      next: (response) => {
        this.cancel();
      },
      error: (error) => {
        this.toastrService.error(
          'An unexpected error occurred while submitting request',
          'Request failed',
          {
            positionClass: 'toast-bottom-left',
            closeButton: true,
          }
        );
      },
    });
  }

  cancel() {
    this.cancelRegister.emit(false);
  }

  get usernameFormControl() {
    return this.registerFormGroup.get('username') as FormControl;
  }

  get passwordFormControl() {
    return this.registerFormGroup.get('password') as FormControl;
  }

  get confirmPasswordFormControl() {
    return this.registerFormGroup.get('confirmPassword') as FormControl;
  }
}
