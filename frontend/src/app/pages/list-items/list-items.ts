
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

  // inyectamos el servicio
  private itemService = inject(ItemService);

  items = signal<Item[]> ([]);
  
  // pedimos datos al service y los guardamos en items
  ngOnInit(): void {
    // petición al backend
    this.itemService.getItems().subscribe({
      // si va bien, array de items
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

  deleteItem(id: number) {
    // llamada delete al backend
    this.itemService.deleteItem(id).subscribe({
      // si va bien
      next: () => {
        console.log('Item eleiminado');
        // actualizar lista items, crea nuevo array
        this.items.update(items => items.filter(item => item.id! == id));
      },
      // si hay error
      error: (error: any) => {
        console.error(error);
      }
      
    });
  }
}
