import { Observable } from 'rxjs';

import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ItemService } from '../../services/item.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from '../../services/toast.service';

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

  // inyectamos servicio Toast
  private toastService = inject(ToastService);


  title = signal('');
  description = signal('');
  loading = signal(false);
  // signal categoría por defecto
  category = signal('Technology');

  // estados touched, mostrar errores solo cuando el usuario interactua
  titleTouched = signal(false);
  descriptionTouched = signal(false);

  // validar titulo
  titleError = computed(() => {
    // .trim, evitamos usuario introduzca solo espacios y sea válido
    const title = this.title().trim();
    // titulo vacío
    if (!title) {
      return ' Title is required';
    }
    // minimo 3 caracteres
    if (title.length < 3) {
      return 'Title must be at least 3 characters';
    }
    // maximo 100 caracteres
    if (title.length > 100) {
      return 'Title cannot exceed 100 characters';
    }
    // devuelve resultado
    return '';
  });

  // validar description
  descriptionError = computed(() => {
    const description = this.description().trim();
    // descripción vacía
    if (!description) {
      return 'Description is required';
    }
    // minimo 10 caracteres
    if (description.length < 10) {
      return 'Description must be at least 10 characters';
    }
    // maximo 500 caracteres
    if (description.length > 500) {
      return 'Description cannot exceed 500 characters';
    }
    // devuelve resultado
    return '';
  });

  // validar formulario
  isFormValid = computed(() => {
    return (
      !this.titleError() &&
      !this.descriptionError()
    );
  })
  

  // saber si estamos editando
  isEditMode = false;

  // guardar ID item
  itemId: number | null = null;


  // editar item
  ngOnInit(): void{
    // obtenemos id URL, snapshot (captura instatánea de la ruta actual), paramMap lee el parámetro de ruta
    const id = this.route.snapshot.paramMap.get('id');
    // si existe id
    if (id) {
      // activamos modo edición
      this.isEditMode = true;
      // guardamos id convertido a número, URL siempre devuelve string
      this.itemId = Number(id);
      // obtenemos datos item del backend
      this.itemService.getItemById(this.itemId).subscribe({
        // si va bien
        next: (item: any) => {
          // rellenamos formulario, actualiza signal
          this.title.set(item.title);
          this.description.set(item.description);
          this.category.set(item.category);
        },
        error: (error: any) => {
          console.error(error);
        }
      });
      console.log('Modo edición', this.itemId);
    }
  }

  // enviar formulario al backend
  saveItem() {
    // activar loading al enviar, petición empieza
    this.loading.set(true);
    // datos formulario
    const itemData = {
      title: this.title(),
      description: this.description(),
      category: this.category(),
    };
    // modo editar
    if (this.isEditMode && this.itemId) {
      // PUT al backend, modo editar
      this.itemService.updateItem(
        this.itemId,
        itemData as any
      ).subscribe({
        // si va bien
        next: () => {
          // desactivamos loading, termina la petición
          this.loading.set(false);
          console.log('Item actualizado');
          // mensaje toast
          this.toastService.show('Item updated successfully', 'success');
          // redirige, volvemos a la lista
          this.router.navigate(['/items']);
        },
        // si hay error
        error: (error: any) => {
          // terminal la petición
          this.loading.set(false);
          //mensaje toast
          this.toastService.show('Failed to save item', 'error')
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
          // termina la petición
          this.loading.set(false);
          console.log('Item creado');
          // mensaje toast
          this.toastService.show('Item created successfully', 'success');
          // redirige, volvemos a la lista
          this.router.navigate(['/items']);
        },
        error: (error: any) => {
          // termina petición
          this.loading.set(false);
          //mensaje toast
          this.toastService.show('Failed to create item', 'error')
          console.error(error);
        }
        
      });
    }
  }

}
