import { Component, inject, signal } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { DrawerModule } from 'primeng/drawer';
import { MenuModule } from 'primeng/menu';
import { AuthService } from '../../../core/services/auth-services';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [ButtonModule, AvatarModule, DrawerModule, MenuModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
  sidebarVisible = signal(false);
  activeMenuItem = signal('Home');

  menuItems = signal([
    { label: 'Home', icon: 'pi pi-home', active: true },
    { label: 'Forum', icon: 'pi pi-comments', active: false },
    { label: 'Galleria', icon: 'pi pi-images', active: false },
    { label: 'Schede Palestra', icon: 'pi pi-chart-bar', active: false },
    { label: 'Appunti', icon: 'pi pi-file', active: false },
  ]);

  setActiveMenu(label: string) {
    this.menuItems.update((items) =>
      items.map((item) => ({
        ...item,
        active: item.label === label,
      }))
    );
    this.activeMenuItem.set(label);
  }

  userMenu: MenuItem[] = [];
  authService: AuthService = inject(AuthService);
  router: Router = inject(Router);

  // username = signal(this.authService.user()?.displayName);
  ngOnInit() {
    this.userMenu = [
      {
        label: 'Profilo',
        icon: 'pi pi-user',
        command: () => this.goToProfile(),
      },
      { separator: true },
      { label: 'Logout', icon: 'pi pi-sign-out', command: () => this.logout() },
    ];
  }

  goToProfile() {
    console.log('Vai al profilo');
  }

  logout() {
    this.authService.logoutUser();
    this.router.navigate(['/login']);
  }
}
