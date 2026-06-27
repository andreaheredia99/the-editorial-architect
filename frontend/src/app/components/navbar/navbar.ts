import { AuthService } from './../../services/auth.service';
import { Component, ElementRef, HostListener, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {

  // ElementRef, este componente navbar, el click ocurrió dentro de mi?
  private elementRef = inject(ElementRef);

  // inyectamos AuthService
  authService = inject(AuthService);

  // inyectamos router
  private router = inject(Router);

  // usamos signal para menu cerrado (false), menu abierto (true)
  menuOpen = signal(false);

  // signal mobile-menu
  mobileMenuOpen = signal(false);

  // si está false lo convierte en true y al revés, click abre, click cierra
  toggleMenu() {
    this.menuOpen.update(value => !value);
  }

  // menu mobil
  toggleMobileMenu() {
    this.mobileMenuOpen.update(value => !value);
  }

  // cerrar menu
  closeMenu() {
    this.menuOpen.set(false);
  }

  closeMenuMobile() {
    this.mobileMenuOpen.set(false);
  }

  logOut() {
    this.authService.logOut();
    this.closeMenu();
    this.router.navigate(['items']);
  }

  // escucha todos los clicks en pantalla
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const clickedInside = this.elementRef.nativeElement.contains(event.target);

    // true, si ocurre dentro de la navbar no hacemos nada
    if(!clickedInside) {
      this.closeMenu();
    }
  }


}
