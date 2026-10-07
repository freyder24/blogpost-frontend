import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Injectable, InputSignal, signal } from '@angular/core';
import { AddCategoryRequest, Category, UpdateCategoryRequest } from '../models/category.model';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private http = inject(HttpClient);
  private apiBaseUrl = 'http://localhost:5125/api';

  addCategoryStatus = signal<'idle' | 'loading' | 'error' | 'success'>('idle');
  updateCategoryStatus = signal<'idle' | 'loading' | 'error' | 'success'>('idle');

  //Crear categoria
  addCategory(category: AddCategoryRequest) {
    this.addCategoryStatus.set('loading');
    this.http.post<void>(`${this.apiBaseUrl}/Categories`, category).subscribe({
      next: () => {
        this.addCategoryStatus.set('success');
      },
      error: () => {
        this.addCategoryStatus.set('error');
      },
    });
  }

  // Obtener todas las categorias
  getAllCategories() {
    return httpResource<Category[]>(() => `${this.apiBaseUrl}/Categories`);
  }

  // Obtener detalle de categoria por id
  getCategoryById(id: InputSignal<string | undefined>) {
    return httpResource<Category>(() => {
      const categoryId = id();

      if (!categoryId) {
        return undefined;
      }

      return `${this.apiBaseUrl}/Categories/${categoryId}`;
    });
  }

  // Actualizar categoria
  updateCategoryById(id: string, updateCategoryRequestDto: UpdateCategoryRequest) {
    this.updateCategoryStatus.set('loading');
    this.http.put<void>(`${this.apiBaseUrl}/Categories/${id}`, updateCategoryRequestDto).subscribe({
      next: () => {
        this.updateCategoryStatus.set('success');
      },
      error: () => {
        this.updateCategoryStatus.set('error');
      },
    });
  }

  // Eliminar categoria
  deleteCategory(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiBaseUrl}/categories/${id}`);
  }
}
