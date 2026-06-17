import { Item } from './../../models/item.model';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ItemService } from '../../services/item.service';
import { ToastService } from '../../services/toast.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-detail-item',
  imports: [RouterLink],
  templateUrl: './detail-item.html',
  styleUrl: './detail-item.css',
})
export class DetailItem implements OnInit {

  // inyectar ActivatedRoute, leer parámetros URL
  private route = inject(ActivatedRoute);

  // inyectar el servicio backend
  private itemService = inject(ItemService);

  // inyectar router Angular
  private router = inject(Router);

  // inyectamos toast Service
  private toastService = inject(ToastService);

  // inyectamos servicio authService
  private authService = inject(AuthService);

  // estado reactivo Item, un solo item
  item = signal<Item | null>(null);

  // cargar item al abrir página
  ngOnInit(): void{

    // obtener parámetro id de URL
    const id = Number(
      this.route.snapshot.paramMap.get('id')
    )

    // llamamos al servicio, pedir item backend
    this.itemService.getItemById(id).subscribe({
      // si responde bien
      next: (data: Item) => {
          // guardamos item
          this.item.set(data);
          console.log(data);
        },
        // si hay error
      error: (error: any) => {
          // mensaje toast
        this.toastService.show('Failed to load items', 'error');
          console.error(error);
      }
    
    
    })
    
  }

  // ¿ es propietario ?
  isOwner() {
    // es admin
    if (this.authService.isAdmin()) {
      return true;
    }
    // item aún no cargado
    const currentItem = this.item();
    // item null
    if (!currentItem) {
      return false;
    }
    // compara owner_id con userId
    const currentUserId = this.authService.getUserId();
    return currentItem.owner_id === currentUserId;
  }

  deleteItem() {
    
    // obtener item actual
    const currentItem = this.item();

    // evitamos errores si item todavía es null
    if (!currentItem) return;

    // llamamos delete backend
    this.itemService.deleteItem(currentItem.id).subscribe({
      // si va bien
      next: () => {
        console.log('Item delete');

        // mensaje toast
        this.toastService.show('Item deleted succesfully', 'success');

        // volvemos lista items
        this.router.navigate(['/items']);
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
