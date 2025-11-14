import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard-guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'register',
    pathMatch: 'full',
  },
  {
    path: 'home',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/home/home/home').then((m) => m.Home),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./features/auth/register/register/register').then(
        (m) => m.Register
      ),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login/login').then((m) => m.Login),
  },
  {
    path: 'profilo',
    loadComponent: () =>
      import('./features/auth/profile-user/profile-user').then(
        (m) => m.ProfileUser
      ),
  },
];
/*  */
