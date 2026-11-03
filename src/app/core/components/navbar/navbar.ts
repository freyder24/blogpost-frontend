import { Component, HostListener, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { LucideMenu, LucideSearch, LucideX } from '@lucide/angular';
import { AuthService } from '../../../features/auth/services/auth-service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, LucideMenu, LucideSearch, LucideX],
  templateUrl: './navbar.html',
})
export class Navbar {
  // signal para controlar el estado del menú y los dropdowns
  readonly isMenuOpen = signal(false);
  isDropdownOpen = signal(false);
  mobileDropdownOpen = signal<string | null>(null);

  // signal para almacenar el usuario autenticado
  authService = inject(AuthService);
  router = inject(Router);

  onLogout() {
    this.authService.logout().subscribe({
      next: () => {
        this.authService.user.set(null);
        this.router.navigate(['/']);
      },
      error: (error) => {
        console.error('Error al cerrar sesión:', error);
      },
    });
  }
  toggleMenu() {
    this.isMenuOpen.update((value) => !value);
  }

  closeMenu() {
    this.isMenuOpen.set(false);
  }

  toggleDropdown() {
    this.isDropdownOpen.update((v) => !v);
  }

  toggleMobileDropdown(name: string) {
    this.mobileDropdownOpen.update((v) => (v === name ? null : name));
  }

  @HostListener('document:keydown.escape')
  onEscape() {
    this.closeMenu();
  }
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;

    if (!target.closest('[data-dropdown]')) {
      this.isDropdownOpen.set(false);
    }
  }
}
