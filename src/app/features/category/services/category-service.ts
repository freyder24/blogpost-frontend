import { HttpClient, HttpParams, httpResource } from '@angular/common/http';
import { inject, Injectable, InputSignal, signal } from '@angular/core';
import { AddCategoryRequest, Category, UpdateCategoryRequest } from '../models/category.model';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private http = inject(HttpClient);
  private apiBaseUrl = environment.apiBaseUrl;

  addCategoryStatus = signal<'idle' | 'loading' | 'error' | 'success'>('idle');
  updateCategoryStatus = signal<'idle' | 'loading' | 'error' | 'success'>('idle');

  //Crear categoria
  addCategory(category: AddCategoryRequest) {
    this.addCategoryStatus.set('loading');
    this.http
      .post<void>(`${this.apiBaseUrl}/api/Categories`, category, {
        // para enviar cookies de sesion al backend, que es necesario para que el backend pueda autenticar al usuario y permitirle crear la categoria.
        withCredentials: true,
      })
      .subscribe({
        next: () => {
          this.addCategoryStatus.set('success');
        },
        error: () => {
          this.addCategoryStatus.set('error');
        },
      });
  }

  // Obtener todas las categorias
  getAllCategories(
    query?: string,
    sortBy?: string,
    sortOrder?: 'asc' | 'desc',
  ): Observable<Category[]> {
    // Crear un objeto HttpParams para agregar el parametro de búsqueda si se proporciona
    let params = new HttpParams();
    if (query) {
      params = params.set('query', query);
    }
    if (sortBy) {
      params = params.set('sortBy', sortBy);
    }
    if (sortOrder) {
      params = params.set('sortOrder', sortOrder);
    }

    return this.http.get<Category[]>(`${this.apiBaseUrl}/api/Categories`, {
      params: params,
    });
  }

  // Obtener detalle de categoria por id
  getCategoryById(id: InputSignal<string | undefined>) {
    return httpResource<Category>(() => {
      const categoryId = id();

      if (!categoryId) {
        return undefined;
      }

      return `${this.apiBaseUrl}/api/Categories/${categoryId}`;
    });
  }

  // Obtener total de categorias
  getCategoryCount(): Observable<number> {
    return this.http.get<number>(`${this.apiBaseUrl}/api/Categories/count`);
  }

  // Actualizar categoria
  updateCategoryById(id: string, updateCategoryRequestDto: UpdateCategoryRequest) {
    this.updateCategoryStatus.set('loading');
    this.http
      .put<void>(`${this.apiBaseUrl}/api/Categories/${id}`, updateCategoryRequestDto, {
        withCredentials: true,
      })
      .subscribe({
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
    return this.http.delete<void>(`${this.apiBaseUrl}/api/Categories/${id}`, {
      withCredentials: true,
    });
  }
}
