import { Router, RouterLink } from '@angular/router';

import { Component, computed, inject, signal } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

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

  // creamos estados Touched, usuario ha interactuado con este campo? Email and Password required
  emailTouched = signal(false);
  passwordTouched = signal(false);

  // validar email
  emailError = computed(() => {
    // .trim, elimina espacios en blanco al principio y al final de las cadenas de strings
    const email = this.email().trim();
    // email vacío
    if (!email) {
      return 'Email is required';
    }
    // Regex = Regular Expression, comprobar si un texto sigue un patrón
    // ^[^\s@]+  empieza con uno o más caracteres, excepto espacios ó @
    // [^\s@]+  uno o más caracteres después del @
    // [^\s@]+  la extensión después del punto
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // formato incorrecto
    if (!emailRegex.test(email)) {
      return 'Invalid email address';
    }
    // devuelve resultado
    return '';
  });

  // validar password
  passwordError = computed(() => {
    const password = this.password().trim();
    // password vacío
    if (!password) {
      return 'Password is required';
    }
    // password debe tener al menos 6 caracteres
    if (password.length < 6) {
      return 'Password must be at least 6 characters';
    }
    // devuelve resultado
    return '';
  });

  // estado global fromulario
  isFormValid = computed(() => {
    return (
      // si email y/o password error = formulario inválido
      !this.emailError() &&
      !this.passwordError()
    );
  });

  // inyectamos los servicios necesarios
  private authService = inject(AuthService);
  private router = inject(Router);
  

  // inyectamos servicio toast
  private toastService = inject(ToastService);


  // Inputs (type casting)
  onEmailInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.email.set(input.value);
    // usuario interactua
    this.emailTouched.set(true);
  }
  onPasswordInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.password.set(input.value);
    // usuario interactua
    this.passwordTouched.set(true);
  }

  
  // Función LOGIN
  onLogin() {
    // validación, evita ejecutar la petición si el formulario no es válido
    if (!this.isFormValid()) {
      // sale de la función
      return;
    }
    this.error.set(''); // borra errores anteriores
    this.loading.set(true); // petición en proceso

    this.authService.login({
      email: this.email(),
      password: this.password()
    }).subscribe({
      next: (response) => {
        // termina loading
        this.loading.set(false);

        // guardamos token, role y userId del usuario
        this.authService.saveToken(response.access_token);
        this.authService.saveRole(response.role);
        this.authService.saveUserId(response.user_id);
        this.authService.saveEmail(response.email);

        // mensaje toast
        this.toastService.show('Welcome back!', 'success');

        // cambia de página sin recargar
        this.router.navigate(['/items']);
      },
      error: () => {
        // termina loading
        this.loading.set(false);
        this.error.set('Invalid credentials')
        // mensaje toast
        this.toastService.show('Invalid Credentials', 'error')
      }
    });
  }
}
