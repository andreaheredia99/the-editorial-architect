import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  imports: [],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {

  // inyectamos AuthService
  authService = inject(AuthService);

  // signal email
  email = signal(this.authService.getEmail());

  // signal role
  role = signal(this.authService.getRole());

  // signal userId
  userId = signal(this.authService.getUserId());
}
