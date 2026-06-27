import { Component, inject, OnInit, signal } from '@angular/core';
import { UserService } from '../../services/user.service';
import { ItemService } from '../../services/item.service';
import { User } from '../../models/user.model';
import { Item } from '../../models/item.model';

@Component({
  selector: 'app-admin',
  imports: [],
  templateUrl: './admin.html',
  styleUrl: './admin.css',
})
export class Admin implements OnInit{

  // inyectamenos UserService
  private userService = inject(UserService);

  // inyectamos ItemService
  private itemService = inject(ItemService);

  // signals
  totalUsers = signal(0);
  totalPosts = signal(0);
  totalEditors = signal(0);
  totalAdmins = signal(0);

  ngOnInit(): void {

    // usuarios
    this.userService.getUsers().subscribe({
      next: (users: User[]) => {
        this.totalUsers.set(users.length);

        const admins = users.filter(user => user.role === 'admin');  // crea array para .length
        const editors = users.filter(user => user.role === 'editor');

        this.totalAdmins.set(admins.length);
        this.totalEditors.set(editors.length);
      },
      error: (error: any) => {
        console.error(error);
      }
    });

    // posts
    this.itemService.getItems().subscribe({
      next: (items: Item[]) => {
        this.totalPosts.set(items.length);
      },
      error: (error: any) => {
        console.error(error);
      }
    });
  }
}
