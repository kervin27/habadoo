import { Component, inject } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';
import { MenuModule } from 'primeng/menu';
import { Router } from '@angular/router';
import { DrawerModule } from 'primeng/drawer';

@Component({
  selector: 'app-navbar',
  imports: [MenubarModule, MenuModule, DrawerModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
  userMenu: MenuItem[] = [];
  sidebarVisible = false;

  router = inject(Router);

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
    console.log('Logout eseguito');
    this.sidebarVisible = false; // chiude la sidebar al logout
  }

  toggleSidebar() {
    this.sidebarVisible = !this.sidebarVisible;
  }

  navigateAndClose(path: string) {
    this.router.navigate([path]);
    this.sidebarVisible = false;
  }
}
