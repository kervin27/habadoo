import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard-guard';
import { PathEnum } from './shared/variables/path.enum';

export const routes: Routes = [
  {
    path: '',
    redirectTo: PathEnum.HOME,
    pathMatch: 'full',
  },
  {
    path: PathEnum.HOME,
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/components/home/home').then((m) => m.Home),
  },
  {
    path: PathEnum.REGISTER,
    loadComponent: () =>
      import('./features/auth/register/register/register').then(
        (m) => m.Register
      ),
  },
  {
    path: PathEnum.LOGIN,
    loadComponent: () =>
      import('./features/auth/login/login/login').then((m) => m.Login),
  },
  {
    path: PathEnum.PROFIFLO,
    loadComponent: () =>
      import('./features/auth/profile-user/profile-user').then(
        (m) => m.ProfileUser
      ),
  },
  {
    path: PathEnum.FORUM,
    loadComponent: () =>
      import('./features/components/forum/forum').then((m) => m.Forum),
  },
];
