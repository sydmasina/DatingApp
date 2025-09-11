import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const toastr = inject(ToastrService);
  const roles = authService.roles();

  if (roles?.includes('Admin') || roles?.includes('Moderator')) {
    return true;
  }

  toastr.error(
    'You do not have permission to access this part of the application.'
  );
  return false;
};
