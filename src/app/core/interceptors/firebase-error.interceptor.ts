// src/app/services/auth.service.ts

import { inject, Injectable } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  AuthError,
  updateProfile,
} from '@angular/fire/auth';
import { ToastService } from '../services/toast-service';
import { TranslateService } from '@ngx-translate/core';

@Injectable({ providedIn: 'root' })
export class FirebaseCatchError {
  toastService = inject(ToastService);
  translateService = inject(TranslateService);

  /**
   * Metodo privato per centralizzare la gestione degli errori Firebase.
   */
  handleFirebaseError(error: any): void {
    // 1. Definisci la chiave i18n
    // Usa un default se il codice non è tra quelli mappati
    const i18nKey =
      `LABEL_FIREBASE.${error.code
        .toUpperCase()
        .replace('AUTH/', '')
        .replace(/-/g, '_')}` || 'LABEL_FIREBASE.UNKNOWN_ERROR';

    // 2. Traduci la chiave in un messaggio leggibile
    // Se la chiave non esiste, translate.instant ritorna la chiave stessa
    const translatedMessage = this.translateService.instant(i18nKey);

    this.toastService.error('ERRORE', translatedMessage);
  }
}
