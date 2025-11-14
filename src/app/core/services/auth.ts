import { Injectable, inject, signal } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isLoggedIn = signal(false);
  private auth = inject(Auth); // <-- qui prende l'istanza fornita da provideAuth

  constructor() {
    onAuthStateChanged(this.auth, (user) => {
      this.isLoggedIn.set(!!user); // true se loggato, false se no
    });
  }

  createUser(email: string, pass: string) {
    return createUserWithEmailAndPassword(this.auth, email, pass);
  }

  loginUser(email: string, pass: string) {
    return signInWithEmailAndPassword(this.auth, email, pass);
  }

  logoutUser() {
    return signOut(this.auth);
  }
}
