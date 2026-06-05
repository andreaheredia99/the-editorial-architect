import { AuthService } from './../../services/auth.service';
import { Component, ElementRef, HostListener, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {

  authService = inject(AuthService);

  // ElementRef, este componente navbar, el click ocurrió dentro de mi?
  private elementRef = inject(ElementRef);

  // usamos signal para menu cerrado (false), menu abierto (true)
  menuOpen = signal(false);

  // si está false lo convierte en true y al revés, click abre, click cierra
  toggleMenu() {
    this.menuOpen.update(value => !value);
  }

  // cerrar menu
  closeMenu() {
    this.menuOpen.set(false);
  }

  logOut() {
    this.authService.logOut();
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
