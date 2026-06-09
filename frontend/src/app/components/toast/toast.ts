import { ToastService } from './../../services/toast.service';
import { Component, inject } from '@angular/core';

@Component({
  selector: 'app-toast',
  imports: [],
  templateUrl: './toast.html',
  styleUrl: './toast.css',
})
export class Toast {
  // inyectamos servicio toast
  toastService = inject(ToastService);
  
}
