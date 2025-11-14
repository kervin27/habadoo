import { inject, effect } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth-services';

export const authGuard: CanActivateFn = async () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (!auth.authReady()) {
    await new Promise<void>((resolve) => {
      let triggered = false;
      effect(() => {
        if (!triggered && auth.authReady()) {
          triggered = true;
          resolve();
        }
      });
    });
  }

  if (!auth.isLoggedIn()) {
    router.navigate(['/login']);
    return false;
  }

  return true;
};
