import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ToastService {

  // reactivo, convertimos a signal, angular actualiza automáticamente el componente Toast
  // guarda el mensaje
  message = signal('');
  // controla mostrar/ocultar toast
  visible = signal(false);
  // creamos signal para tipo de mensaje
  type = signal<'success' | 'error'>('success');
  

  // mostrar toast
  show(message: string, type: 'success' | 'error' = 'success') {
    // guardamos mensaje
    this.message.set(message);
    //tipo toast
    this.type.set(type);
    // hacemos visible el toast
    this.visible.set(true);
    // duración del mensaje
    setTimeout(() => {
      this.hide();
    }, 3000);
  }

  // ocultar toast
  hide() {
    this.visible.set(false);
  }
}
