import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './core/services/auth-services';
import { Navbar } from './shared/components/navbar/navbar';
import { TranslateService } from '@ngx-translate/core';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, ToastModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected title = 'habadoo';

  authService: AuthService = inject(AuthService);
  translate: TranslateService = inject(TranslateService);

  constructor() {
    this.translate.use('it');
  }
}
