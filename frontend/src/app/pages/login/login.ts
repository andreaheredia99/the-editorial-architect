import { Router } from '@angular/router';

import { Component, signal } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  email = signal('');
  password = signal('');
  error = signal(''); // mensaje error para usuario

  // solicitamos los servicios necesarios
  constructor(
    private authService: AuthService,
    private router: Router
  ) { }


  // Inputs (type casting)
  onEmailInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.email.set(input.value);
  }
  onPasswordInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.password.set(input.value);
  }

  
  // Función LOGIN
  onLogin() {
    this.error.set(''); // borra errores anteriores

    this.authService.login({
      email: this.email(),
      password: this.password()
    }).subscribe({
      next: (response) => {
        // guardamos token del usuario
        this.authService.saveToken(response.access_token);

        // cambia de página sin recargar
        this.router.navigate(['/items']);
      },
      error: () => {
        this.error.set('Invalid credentials')
      }
    });
  }
}
