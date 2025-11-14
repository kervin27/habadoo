import {
  ApplicationConfig,
  importProvidersFrom,
  inject,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import Lara from '@primeuix/themes/lara';
import { providePrimeNG } from 'primeng/config';
import { routes } from './app.routes';

import { HttpClient, provideHttpClient } from '@angular/common/http';
import { getAnalytics, provideAnalytics } from '@angular/fire/analytics';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { ToastService } from './core/services/toast-service';
import { StandaloneHttpLoader } from './standalone-http-loader';
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
    provideHttpClient(),
    // PrimeNG
    providePrimeNG({ theme: { preset: Lara } }),

    // Firebase
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideAnalytics(() => getAnalytics()),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    importProvidersFrom(
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: () => new StandaloneHttpLoader(inject(HttpClient)),
        },
      })
    ),
    MessageService,
    ToastService,
  ],
};
