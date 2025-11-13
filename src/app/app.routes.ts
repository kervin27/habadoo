import { Routes } from '@angular/router';
import { App } from './app';
import { Home } from './features/home/home/home';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    component: Home,
  },
];
