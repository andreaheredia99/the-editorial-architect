//servicios para conectar con fastapi

import { computed, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { LoginRequest, LoginResponse, RegisterResponse } from '../models/auth.model';

// Angular puede usar este servicio en toda la app
@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private apiUrl = environment.apiUrl;

  // URL register
  private registerUrl = `${environment.apiUrl}/register`;

  // empieza en null hasta cargar localStorage
  private token = signal<string | null>(null);

  // convierte token existente (true) o null (false)
  isAuthenticated = computed(() => !!this.token());

  // para hacer peticiones http
  constructor(private http: HttpClient) {
    // servicio se crea, intenta recuperar token guardado
    this.loadToken();
   }
  
  login(data: LoginRequest) {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, data);
  }

  register(data: LoginRequest) {
    return this.http.post<RegisterResponse>(this.registerUrl, data);
  }

  saveToken(token: string) {
    // PERSISTENCIA, token siga existiendo
    localStorage.setItem('token', token);
    // REACTIVIDAD, angular sabe cambios, app cambia automáticamente
    this.token.set(token);
  }

  // se ejcuta al arrancar la app
  loadToken() {
    // intenta leer token guardado
    const token = localStorage.getItem('token');

    // si existe token
    if (token) {
      // actualiza signal
      this.token.set(token);
    }
  }

  // token actual
  getToken() {
    return this.token();
  }

  logOut() {
    // elimina token del navegador
    localStorage.removeItem('token');

    // actualiza signal o null
    this.token.set(null);
  }
}
