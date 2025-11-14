import { Component, inject } from '@angular/core';
import { AuthService } from '../../../core/services/auth-services';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  authService: AuthService = inject(AuthService);

  constructor() {
    console.log(this.authService.user());
  }
}
