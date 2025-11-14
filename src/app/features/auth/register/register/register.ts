import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
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
import { ToastModule } from 'primeng/toast';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { AuthService } from '../../../../core/services/auth';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-register',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    ToastModule,
    CardModule,
    RouterLink,
  ],
  templateUrl: './register.html',
  styleUrl: './register.scss',
  standalone: true,
})
export class Register {
  authService: AuthService = inject(AuthService);
  messageService: MessageService = inject(MessageService);
  router: Router = inject(Router);

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
        .createUser(
          this.registerForm.value.email!,
          this.registerForm.value.password!
        )
        .then((userCredential) => {
          // Signed up
          const user = userCredential.user;
          this.messageService.add({
            severity: 'success',
            summary: 'Registrazione completata',
            detail: 'Il tuo account è stato creato con successo!',
            life: 3000,
          });
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 3000);
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          // ..
        });
    }
  }
}
