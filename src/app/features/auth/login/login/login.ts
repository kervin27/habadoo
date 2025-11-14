import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

// PrimeNG modules
import { Router, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { AuthService } from '../../../../core/services/auth-services';
import { FirebaseCatchError } from '../../../../core/interceptors/firebase-error.interceptor';
import { ToastService } from '../../../../core/services/toast-service';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    CardModule,
    RouterLink,
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  authService: AuthService = inject(AuthService);
  router: Router = inject(Router);
  toastService: ToastService = inject(ToastService);
  firebaseCatchError: FirebaseCatchError = inject(FirebaseCatchError);

  registerForm = new FormGroup({
    email: new FormControl<string>('', {
      validators: [Validators.required, Validators.email],
      nonNullable: true,
    }),
    password: new FormControl<string>('', {
      validators: [Validators.required],
      nonNullable: true,
    }),
  });

  passwordDimenticata = signal(false);

  submit() {
    if (this.passwordDimenticata()) {
      this.authService
        .resetPassword(this.registerForm.value.email!)
        .then(() => {
          this.toastService.success(
            'EMAIL INVIATA',
            `Il link per il reset è stata inviata all'indirizzo ${this.registerForm.value.email}`
          );
          this.passwordDimenticata.set(false);
          this.registerForm.reset();
        })
        .catch((error) => {
          this.firebaseCatchError.handleFirebaseError(error);
        });
    } else {
      this.authService
        .loginUser(
          this.registerForm.value.email!,
          this.registerForm.value.password!
        )
        .then(() => {
          this.router.navigate(['/home']);
        })
        .catch((error) => {
          this.firebaseCatchError.handleFirebaseError(error);
        });
    }
  }

  resetPassword() {
    this.passwordDimenticata.set(!this.passwordDimenticata());
  }
}
