import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { delay, finalize, identity } from 'rxjs';
import { environment } from '../../../environments/environment';
import { BusyService } from '../services/busy.service';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const busyService = inject(BusyService);

  if (!req.url.includes('/api/Cities')) {
    busyService.busy();
  }

  return next(req).pipe(
    environment.production ? identity : delay(1000),
    finalize(() => {
      busyService.idle();
    })
  );
};
