import { inject } from '@angular/core';
//servicios para conectar con fastapi

import { computed, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { LoginRequest } from '../models/login-request.model';
import { LoginResponse } from '../models/login-response.model';
import { RegisterResponse } from '../models/register-response.model';



// Angular puede usar este servicio en toda la app
@Injectable({
  providedIn: 'root',
})
export class AuthService {

  // URL backend auth
  private apiUrl = environment.apiUrl;

  // URL register
  private registerUrl = `${environment.apiUrl}/register`;

  // empieza en null hasta cargar localStorage
  private token = signal<string | null>(localStorage.getItem('token'));

  // signal para role, lee localStorage directamente
  private role = signal<string | null>(localStorage.getItem('role'));

  // signal para UserId, number convierte porque localStorgae siempre guarda texto
  private userId = signal<number | null>(Number(localStorage.getItem('userId')));

  // signal email
  private email = signal<string | null>(localStorage.getItem('email'));

  // convierte token existente (true) o null (false)
  isAuthenticated = computed(() => !!this.token());

  // para hacer peticiones http
  private http = inject (HttpClient);
  
  // autenticar
  login(data: LoginRequest) {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, data);
  }

  /// crear usuarios
  register(data: LoginRequest) {
    return this.http.post<RegisterResponse>(this.registerUrl, data);
  }

  // login debe guardar JWT
  saveToken(token: string) {
    // PERSISTENCIA, token siga existiendo
    localStorage.setItem('token', token);
    // REACTIVIDAD, angular sabe cambios, app cambia automáticamente
    this.token.set(token);
  }

  // login guarda role
  saveRole(role: string) {
    localStorage.setItem('role', role);
    this.role.set(role);
  }

  // login guarda userId
  saveUserId(userId: number) {
    // toString() porque localStorage solo almacena string
    localStorage.setItem('userId', userId.toString());
    this.userId.set(userId);
  }

  // login guarda email
  saveEmail(email: string) {
    localStorage.setItem('email', email);
    this.email.set(email);
  }

  // token actual
  getToken() {
    return this.token();
  }

  // role actual
  getRole() {
    return this.role();
  }

  // userId actual
  getUserId() {
    return this.userId();
  }

  // email actual
  getEmail() {
    return this.email();
  }

  // obtener letra avatar
  getAvatarLetter() {
    const email = this.email();
    if (!email) {
    return '';
    }
    // charAt(0), devuelve caracter ubicado en el índice indicado, en mayúsculas
    return email.charAt(0).toUpperCase();
  }

  // role
  isAdmin() {
    return this.role() === 'admin';
  }

  isEditor() {
    return this.role() === 'editor';
  }

  logOut() {
    // elimina token, role y userId del navegador
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    localStorage.removeItem('email');

    // actualiza signal o null
    this.token.set(null);
    this.role.set(null);
    this.userId.set(null);
    this.email.set(null);
  }


}
