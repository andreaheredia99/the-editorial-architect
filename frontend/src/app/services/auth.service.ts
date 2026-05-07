//servicios para conectar con fastapi

import { computed, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { LoginRequest, LoginResponse } from '../models/auth.model';

// Angular puede usar este servicio en toda la app
@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private apiUrl = environment.apiUrl;

  // guarda el token o null
  private token = signal<string | null>(localStorage.getItem('token'));

  // convierte token existente (true) o null (false)
  isAuthenticated = computed(() => !!this.token());

  // para hacer peticiones http
  constructor(private http: HttpClient) { }
  
  login(data: LoginRequest) {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, data);
  }

  saveToken(token: string) {
    // PERSISTENCIA, token siga existiendo
    localStorage.setItem('token', token);
    // REACTIVIDAD, angular sabe cambios, app cambia automáticamente
    this.token.set(token);
  }

  getToken() {
    return this.token();
  }

  logOut() {
    localStorage.removeItem('token');
    this.token.set(null);
  }
}
