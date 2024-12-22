import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';

const BASE_URL = 'http://localhost:4242'; // Your backend server URL

@Injectable({
  providedIn: 'root',
})
export class StoreService {
  constructor(private httpClient: HttpClient) {}

  // Fetch all categories
  getAllCategories(): Observable<Array<{ id: number; name: string; description: string }>> {
    return this.httpClient.get<Array<{ id: number; name: string; description: string }>>(
      `${BASE_URL}/categories`
    );
  }

  // Fetch all products with optional sorting and limit
  getAllProducts(limit = '12', sort = 'desc'): Observable<Array<Product>> {
    return this.httpClient.get<Array<Product>>(`${BASE_URL}/products?sort=${sort}&limit=${limit}`);
  }

  // Fetch products by category ID with optional sorting and limit
  getProductsByCategory(categoryId: number, sort = 'desc', limit = '12'): Observable<Array<Product>> {
    return this.httpClient.get<Array<Product>>(
      `${BASE_URL}/products/${categoryId}?sort=${sort}&limit=${limit}`
    );
  }
}

