import { Router, RouterLink } from '@angular/router';

import { Component, signal } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  email = signal(''); // guardamos email
  password = signal(''); // guardamos contraseña
  error = signal(''); // mensaje error para usuario
  loading = signal(false); // petición (request)

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
    this.loading.set(true); // petición en proceso

    this.authService.login({
      email: this.email(),
      password: this.password()
    }).subscribe({
      next: (response) => {
        // termina loading
        this.loading.set(false);

        // guardamos token del usuario
        this.authService.saveToken(response.access_token);

        // cambia de página sin recargar
        this.router.navigate(['/items']);
      },
      error: () => {
        // termina loading
        this.loading.set(false);
        this.error.set('Invalid credentials')
      }
    });
  }
}
