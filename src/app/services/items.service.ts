import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, throwError } from 'rxjs';
import { Item } from '../models/item.model';

interface ProductsResponse { products: Item[]; total: number; skip: number; limit: number; }

@Injectable({ providedIn: 'root' })
export class ItemsService {
  private readonly API = 'https://dummyjson.com/products';
  private readonly LIMIT = 20;

  constructor(private http: HttpClient) {}

  getItems(query = '', page = 1): Observable<{ items: Item[]; total: number; page: number; }> {
    const skip = (page - 1) * this.LIMIT;
    const url = query?.trim()
      ? `${this.API}/search?q=${encodeURIComponent(query)}&limit=${this.LIMIT}&skip=${skip}`
      : `${this.API}?limit=${this.LIMIT}&skip=${skip}`;

    return this.http.get<ProductsResponse>(url).pipe(
      map(res => ({ items: res.products, total: res.total, page })),
      catchError(err => throwError(() => new Error(err?.message || 'Failed to fetch items')))
    );
  }

  getItemById(id: string | number): Observable<Item> {
    return this.http.get<Item>(`${this.API}/${id}`).pipe(
      catchError(err => throwError(() => new Error(err?.message || 'Failed to fetch item')))
    );
  }
}
