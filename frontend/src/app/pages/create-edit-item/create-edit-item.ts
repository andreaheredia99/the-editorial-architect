import { Observable } from 'rxjs';

import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ItemService } from '../../services/item.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-create-edit-item',
  // componente independiente, no necesita estar dentro de un módulo
  standalone: true,
  // habilita ngModel
  imports: [FormsModule],
  templateUrl: './create-edit-item.html',
  styleUrl: './create-edit-item.css',
})
export class CreateEditItem {
  // servicio backend
  private itemService = inject(ItemService);
  // router Angular
  private router = inject(Router);

  // ActivatedRoute permite leer parámetros de ruta, query params y URL actual
  private route = inject(ActivatedRoute);

  // saber si estamos editando
  isEditMode = false;

  // guardar ID item
  itemId: number | null = null;


  title = signal('');
  description = signal('');

  // editar item
  ngOnInit(): void{
    // obtenemos id URL, snapshot (captura instatánea de la ruta actual), paramMap lee el parámetro de ruta
    const id = this.route.snapshot.paramMap.get('id');
    // si existe id
    if (id) {
      // activamos modo edición
      this.isEditMode = true;
      // guardamos id convertido a número, URL devuelve string
      this.itemId = Number(id);
      // obtenemos datos item del backend
      this.itemService.getItemById(this.itemId).subscribe({
        // si va bien
        next: (item: any) => {
          // rellenamos formulario, actualiza signal
          this.title.set(item.title);
          this.description.set(item.description);
          console.log(item);
        },
        error: (error: any) => {
          console.error(error);
        }
      });
      console.log('Modo edición', this.itemId);
    }
  }

  saveItem() {
    // datos formulario
    const itemData = {
      title: this.title(),
      description: this.description(),
    };
    // decidimos modo editar o modo crear
    if (this.isEditMode && this.itemId) {
      // PUT al backend, modo editar
      this.itemService.updateItem(
        this.itemId,
        itemData as any
      ).subscribe({
        // si va bien
        next: () => {
          console.log('Item actualizado');
          // redirige, volvemos a la lista
          this.router.navigate(['/items']);
        },
        // si hay error
        error: (error: any) => {
          console.error(error);
        }
      });
    }
    // modo crear
    else {
      // post al backend
      this.itemService.createItem(
        itemData as any
      ).subscribe({
        // si va bien
        next: () => {
          console.log('Item creado');
          // redirige, volvemos a la lista
          this.router.navigate(['/items']);
        },
        error: (error: any) => {
          console.error(error);
        }
        
      });
    }
  }

}
