import { Component, signal } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {

  email = signal('');
  password = signal('');
  error = signal('');
  success = signal('');
  loading = signal(false);

  // inyectamos servicios necesarios
  constructor(
    private authService: AuthService,
    private router: Router
  ) { }
  
  // Input Email
  onEmailInput(event: Event) {
    // convertimos target evento en input HTML real
    const input = event.target as HTMLInputElement;
    // actualiza signal email
    this.email.set(input.value);
  }

  // Input Password
  onPasswordInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.password.set(input.value);
  }

  // Input Register
  onRegister() {
    // limpia errores anteriores
    this.error.set('');

    // limpia mensaje exito anterior
    this.success.set('');

    // petición en proceso
    this.loading.set(true);

    // llamada HTTP al backend
    this.authService.register({
      //email y password actuales
      email: this.email(),
      password: this.password()
    })
      // escucha respuesta backend
      .subscribe({
        // register okay
        next: (response) => {
          // termina loading
          this.loading.set(false);

          // mensaje exito
          this.success.set(response.message);

          // tiempo espera
          setTimeout(() => {
            // navega login
            this.router.navigate(['/login']);
          }, 1500);
        },
        
        // register error
        error: () => {
          // termina loading
          this.loading.set(false);
          //mensaje error usuario
          this.error.set('User already exists');
        }
    })
  }

}
