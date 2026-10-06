import { Component, HostListener, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideMenu, LucideSearch, LucideX } from '@lucide/angular';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, LucideMenu, LucideSearch, LucideX],
  templateUrl: './navbar.html',
})
export class Navbar {
  readonly isMenuOpen = signal(false);
  isDropdownOpen = signal(false);
  mobileDropdownOpen = signal<string | null>(null);

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
