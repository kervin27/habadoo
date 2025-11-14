import { Routes } from '@angular/router';
import { App } from './app';
import { Home } from './features/home/home/home';
import { Register } from './features/auth/register/register/register';
import { Login } from './features/auth/login/login/login';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'register',
    pathMatch: 'full',
  },
  {
    path: 'home',
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
