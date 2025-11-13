import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { ItemsService } from '../../../services/items.service';
import { Item } from '../../../models/item.model';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-item-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './item-details.html',
  styleUrls: ['./item-details.css']
})
export class ItemDetails {
  private route = inject(ActivatedRoute);
  private api = inject(ItemsService);
  private location = inject(Location);

  loading = signal(true);
  error = signal<string | null>(null);
  item: Item | null = null;

  constructor() {
    this.route.paramMap
      .pipe(switchMap(pm => {
        const id = pm.get('id');
        this.loading.set(true);
        this.error.set(null);
        return this.api.getItemById(String(id));
      }))
      .subscribe({
        next: (it: Item) => { this.item = it; this.loading.set(false); },
        error: (err: unknown) => { this.error.set(String(err)); this.loading.set(false); }
      });
  }

  back() { this.location.back(); }
}
