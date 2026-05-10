import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Item } from '../models/item.model';

@Injectable({
  providedIn: 'root',
})
export class ItemService {
  
  private apiUrl = `${environment.apiUrl}/items`;
  // petición http, comunicación con FastAPI
  constructor(private http: HttpClient) { }
  
  getItems(): Observable<Item[]> {
    return this.http.get<Item[]>(this.apiUrl + '/');
    // array de items
  }

  // recibe item del formulario, Observable (FastAPI JSON)
  createItem(item: Item): Observable<Item>{
    // envia datos al backend
    return this.http.post<Item>(
      // URL backend
      this.apiUrl + '/',
      item
    );
  } 

  deleteItem(id: number) {
    // delete al backend
    return this.http.delete(
      `${this.apiUrl}/${id}` // ruta

    );
  }

  updateItem(id: number, item: Item) {
    // PUT al backend, actualiza datos existentes
    return this.http.put<Item>(
      `${this.apiUrl}/${id}`, // url dinámica, /items/5
      item  // nuevos datos
    );
  }

  getItemById(id: number) {
    return this.http.get<Item>(
      `${this.apiUrl}/${id}`
    );
  }
}
