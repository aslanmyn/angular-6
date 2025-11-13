import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ItemsService } from '../../../services/items.service';
import { Item } from '../../../models/item.model';
import { ItemCard } from '../item-card/item-card';

@Component({
  selector: 'app-items-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ItemCard],
  templateUrl: './items-list.html',
  styleUrls: ['./items-list.css']
})
export class ItemsList {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private api = inject(ItemsService);

  q = signal('');
  loading = signal(false);
  error = signal<string | null>(null);
  items = signal<Item[]>([]);

  constructor() {
    // здесь мы слушаем ИЗМЕНЕНИЯ query-параметров
    this.route.queryParamMap.subscribe(pm => {
      const search = pm.get('q') ?? '';
      this.q.set(search);
      this.fetch(search);
    });
  }

  onSearchChange(value: string) {
    this.router.navigate([], {
      queryParams: { q: value || null },
      queryParamsHandling: 'merge'
    });
  }

  private fetch(search: string) {
    this.loading.set(true);
    this.error.set(null);

    this.api.getItems(search).subscribe({
      next: (res: { items: Item[]; total: number; page: number }) => {
        this.items.set(res.items);
        this.loading.set(false);
      },
      error: (err: unknown) => {
        this.error.set(String(err));
        this.loading.set(false);
      }
    });
  }
}
