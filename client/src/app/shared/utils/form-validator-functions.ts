import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const passwordMatchValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const passwordCtrl = control.get('password');
  const confirmPasswordCtrl = control.get('confirmPassword');

  if (passwordCtrl?.value !== confirmPasswordCtrl?.value) {
    confirmPasswordCtrl?.setErrors({ passwordMismatch: true });
    return { passwordMismatch: true };
  }

  confirmPasswordCtrl?.setErrors(null);
  return null;
};
