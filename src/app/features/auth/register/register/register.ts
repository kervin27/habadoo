import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

// PrimeNG modules
import { updateProfile } from '@angular/fire/auth';
import { Router, RouterLink } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { AuthService } from '../../../../core/services/auth-services';
import { FirebaseCatchError } from '../../../../core/interceptors/firebase-error.interceptor';
import { ToastService } from '../../../../core/services/toast-service';
@Component({
  selector: 'app-register',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    CardModule,
    RouterLink,
  ],
  templateUrl: './register.html',
  styleUrl: './register.scss',
  standalone: true,
})
export class Register {
  authService: AuthService = inject(AuthService);
  router: Router = inject(Router);
  transalteService: TranslateService = inject(TranslateService);
  toastService: ToastService = inject(ToastService);
  firebaseCatchError: FirebaseCatchError = inject(FirebaseCatchError);

  registerForm = new FormGroup(
    {
      username: new FormControl<string>('', {
        validators: [Validators.required],
        nonNullable: true,
      }),
      email: new FormControl<string>('', {
        validators: [Validators.required, Validators.email],
        nonNullable: true,
      }),
      password: new FormControl<string>('', {
        validators: [Validators.required, Validators.minLength(6)],
        nonNullable: true,
      }),
      confirmPassword: new FormControl<string>('', {
        validators: [Validators.required, Validators.minLength(6)],
        nonNullable: true,
      }),
    },
    { validators: this.passwordMatchValidator }
  );

  constructor() {}

  passwordMatchValidator(form: any) {
    const password = form.get('password')?.value;
    const confirm = form.get('confirmPassword')?.value;
    return password === confirm ? null : { passwordMismatch: true };
  }

  submit() {
    if (this.registerForm.valid) {
      this.authService
        .checkPassword(this.registerForm.value.password!)
        .then((res) => {
          if (res.isValid) {
            return this.authService.createUser(
              this.registerForm.value.email!,
              this.registerForm.value.password!
            );
          } else {
            this.toastService.error(
              'PASSWORD NON VALIDA',
              `La password non rispetta i criteri richiesti`
            );
            return;
          }
        })
        .then((userCredential) => {
          if (userCredential) {
            // Aggiorna il displayName
            updateProfile(userCredential.user, {
              displayName: this.registerForm.value.username,
            });
            this.toastService.success(
              'CONFERMA REGISTRAZIONE',
              `La registrazione è avvenuta con successo`
            );
            setTimeout(() => {
              this.router.navigate(['/login']);
            }, 3000);
          } else {
            return;
          }
        })
        .catch((error) => {
          this.firebaseCatchError.handleFirebaseError(error);
        });
    }
  }
}
