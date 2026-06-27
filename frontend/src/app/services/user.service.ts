import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {

  // inyectamos httpClient
  private http = inject(HttpClient);

  // URL del endpoint
  private apiUrl = `${environment.apiUrl}/users`;

  // funcion obtener usuarios
  getUsers() {
    return this.http.get<User[]>(this.apiUrl);
  }
}
