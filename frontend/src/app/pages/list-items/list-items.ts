
import { Component, inject, OnInit, signal } from '@angular/core';
import { Item } from '../../models/item.model';
import { ItemService } from '../../services/item.service';
import { RouterLink } from "@angular/router";
import { ToastService } from '../../services/toast.service';


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

  // inyectamos servicio Toast
  private toastService = inject(ToastService);

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
        // mensaje toast
        this.toastService.show('Failed to load items', 'error');
        console.error(error);
      }
    });
  }

  // eliminar item concreto
  deleteItem(id: number) {
    // confirmamos eliminar
    const confirmed = confirm(
      'Are you sure you want to dlete this item?'
    );
    // no confirmado, salir del método, no llamar al backend
    if (!confirmed) {
      return;
    }
    // llamada delete al backend
    this.itemService.deleteItem(id).subscribe({
      // si responde bien
      next: () => {
        console.log('Item eliminado');
        // actualizar lista items, crea nuevo array sin el item eliminado
        this.items.update(items => items.filter(item => item.id! !== id));
        // mensaje toast
        this.toastService.show('Item deleted succesfully', 'success');
      },
      // si hay error
      error: (error: any) => {
        // mensaje toast
        this.toastService.show('Failed to delete item', 'error');
        console.error(error);
      }
      
    });
  }
}
