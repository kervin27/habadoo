import { Injectable, inject, signal } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  PasswordValidationStatus,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  User,
  UserCredential,
  validatePassword,
} from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isLoggedIn = signal(false);
  user = signal<User | null>(null);
  idToken = signal<string | null>(null);
  // Signal che indica quando Firebase ha completato il primo check
  authReady = signal(false);
  private auth = inject(Auth); // <-- qui prende l'istanza fornita da provideAuth

  constructor() {
    // Ascolta lo stato di autenticazione Firebase
    onAuthStateChanged(this.auth, async (user) => {
      this.user.set(user);
      this.isLoggedIn.set(!!user);

      if (user) {
        // Ottieni il token JWT Firebase
        const token = await user.getIdToken();
        this.idToken.set(token);

        // Salva nel localStorage per accesso veloce
        localStorage.setItem('token', token);
      } else {
        this.idToken.set(null);
        localStorage.removeItem('token');
      }

      // 🔹 Segnala che Firebase ha completato il primo controllo
      this.authReady.set(true);
    });
  }

  createUser(email: string, pass: string): Promise<UserCredential> {
    return createUserWithEmailAndPassword(this.auth, email, pass);
  }

  loginUser(email: string, pass: string): Promise<UserCredential> {
    return signInWithEmailAndPassword(this.auth, email, pass);
  }

  resetPassword(email: string): Promise<void> {
    return sendPasswordResetEmail(this.auth, email);
  }

  logoutUser(): Promise<void> {
    return signOut(this.auth);
  }

  checkPassword(password: string): Promise<PasswordValidationStatus> {
    return validatePassword(this.auth, password);
  }
}
