
import { Component, inject, OnInit, signal } from '@angular/core';
import { Item } from '../../models/item.model';
import { ItemService } from '../../services/item.service';
import { RouterLink } from "@angular/router";


@Component({
  selector: 'app-list-items',
  imports: [RouterLink],
  standalone: true,
  templateUrl: './list-items.html',
  styleUrl: './list-items.css',
})
export class ListItems implements OnInit{

  // inyectamos el servicio, acceso backend CRUD
  private itemService = inject(ItemService);

  // estado reactivo, cuando items cambia Angular actualiza automáticamente, array items
  items = signal<Item[]> ([]);
  
  // pedimos datos al service y los guardamos en items (carga items al entrar a la página)
  ngOnInit(): void {
    // petición al backend, llama API FastaAPI y espera respuesta Observable
    this.itemService.getItems().subscribe({
      // si responde bien, array de items
      next: (data: Item[]) => {
        // guardamos item
        this.items.set(data);
        console.log(data);
      },
      // si hay error
      error: (error: any) => {
        console.error(error);
      }
    });
  }

  // eliminar item concreto
  deleteItem(id: number) {
    // llamada delete al backend
    this.itemService.deleteItem(id).subscribe({
      // si responde bien
      next: () => {
        console.log('Item eliminado');
        // actualizar lista items, crea nuevo array sin el item eliminado
        this.items.update(items => items.filter(item => item.id! !== id));
      },
      // si hay error
      error: (error: any) => {
        console.error(error);
      }
      
    });
  }
}
