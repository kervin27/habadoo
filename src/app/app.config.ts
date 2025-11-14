import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { providePrimeNG } from 'primeng/config';
import Lara from '@primeuix/themes/lara';
import { routes } from './app.routes';

import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAnalytics, getAnalytics } from '@angular/fire/analytics';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { MessageService } from 'primeng/api';

// Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyDYec7HjwJe56YtS4l_ehdVOEgZdM8JAN0',
  authDomain: 'habadoo-app.firebaseapp.com',
  projectId: 'habadoo-app',
  storageBucket: 'habadoo-app.firebasestorage.app',
  messagingSenderId: '713827901334',
  appId: '1:713827901334:web:d16dc728f0f35bee4747b7',
  measurementId: 'G-7497D7RZYC',
};

export const appConfig: ApplicationConfig = {
  providers: [
    // Angular essentials
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideAnimations(),

    // PrimeNG
    providePrimeNG({ theme: { preset: Lara } }),

    // Firebase
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideAnalytics(() => getAnalytics()),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),

    MessageService,
  ],
};
