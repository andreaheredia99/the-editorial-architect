import { RouterLink } from '@angular/router';
import { Item } from '../../models/item.model';
import { AuthService } from '../../services/auth.service';
import { ItemService } from './../../services/item.service';
import { Component, inject, OnInit, signal } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit{
  // acceso backend
  private itemService = inject(ItemService);

  // usuario actual
  private authService = inject(AuthService);

  // signal total posts
  totalPosts = signal(0);

  // posts del usuario
  myPosts = signal(0);

  // signal últimos posts
  recentPosts = signal<Item[]>([]);

  // signal role
  role = signal('');

  ngOnInit(): void {
    this.itemService.getItems().subscribe({
      next: (items: Item[]) => {
        // longitud posts
        this.totalPosts.set(items.length);
        // usuario actual
        const currentUserId = this.authService.getUserId();
        // posts del usuario actual
        const myPosts = items.filter(item => item.owner_id === currentUserId);
        // guardamos total posts
        this.myPosts.set(myPosts.length);
        // posts recientes
        this.recentPosts.set(items.slice(0, 3));
        // role, ?? ai lo de la izq existe usalo, '' si es null (no está logado) usa lo de la derecha
        this.role.set(this.authService.getRole()?? '');

      },
      error: (error: any) => {
        console.error(error);
      }
    })
  }
}
