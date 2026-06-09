import { AuthService } from './../../services/auth.service';
import { Component, signal, inject, computed } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ToastService } from '../../services/toast.service';

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

  // estados Touched
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

  // inyectamos servicios necesarios
  private authService = inject(AuthService);
  private router = inject(Router);
 
  // inyectamos servicio Toast
  private toastService = inject(ToastService);
  
  // Input Email
  onEmailInput(event: Event) {
    // convertimos target evento en input HTML real
    const input = event.target as HTMLInputElement;
    // actualiza signal email
    this.email.set(input.value);
    // usuario interactua
    this.emailTouched.set(true);
  }

  // Input Password
  onPasswordInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.password.set(input.value);
    // usuario interactua
    this.passwordTouched.set(true);
  }

  // Input Register
  onRegister() {
    // validación, evita ejecutar la petición si el formulario no es válido
    if (!this.isFormValid()) {
      // sale de la función
      return;
    }
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

          // mensaje toast
          this.toastService.show('Account created succesfully', 'success');

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
          // mensaje toast
          this.toastService.show('User already exists', 'error')
        }
    })
  }

}
