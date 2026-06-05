import { Component, signal, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';
import { Navbar } from './components/navbar/navbar';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, Navbar],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
  
  // RouterOutlet = renderiza paginas (codigo a visual - dibuja)
  // RouterLink = permite navegar
  
export class App {

  // ejemplo Angular signals 
  protected readonly title = signal('frontend-app');

  // inyectar servicio para acceder a auth global
  protected authService = inject(AuthService);

  // cerrar sesión
  logOut() {
    this.authService.logOut();
  }
}
