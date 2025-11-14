import { Routes } from '@angular/router';
import { App } from './app';
import { Home } from './features/home/home/home';
import { Register } from './features/auth/register/register/register';
import { Login } from './features/auth/login/login/login';
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
    component: Home,
  },
  {
    path: 'register',
    component: Register,
  },
  {
    path: 'login',
    component: Login,
  },
];
