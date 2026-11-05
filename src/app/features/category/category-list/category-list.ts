import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CategoryService } from '../services/category-service';
import { TruncatePipe } from '../../../core/pipes/truncate-pipe';
import { Category } from '../models/category.model';

@Component({
  selector: 'app-category-list',
  imports: [RouterLink, TruncatePipe, FormsModule],
  templateUrl: './category-list.html',
})
export class CategoryList implements OnInit {
  private categoryService = inject(CategoryService);

  private readonly sortField = 'name';
  sortOrder: 'asc' | 'desc' = 'asc';
  private searchTerm = '';

  isError = signal(false);
  isLoading = signal(true);
  isSortByOpen = signal(false);

  filteredCategories: Category[] = [];

  ngOnInit() {
    this.loadCategories();
  }

  // Cargar categorias desde el backend
  loadCategories(query?: string) {
    this.isLoading.set(true);
    this.isError.set(false);
    this.categoryService.getAllCategories(query, this.sortField, this.sortOrder).subscribe({
      next: (categories) => {
        this.filteredCategories = this.sortCategories(categories);
        this.isLoading.set(false);
      },
      error: () => {
        this.isError.set(true);
        this.isLoading.set(false);
      },
    });
  }

  // Manejar la busqueda de categorias
  onSearch(query: string) {
    this.searchTerm = query.trim();
    this.loadCategories(this.searchTerm || undefined);
  }

  // toggle el menu de ordenamiento
  toggleSortBy() {
    this.isSortByOpen.update((open) => !open);
  }

  // Manejar el cambio de ordenamiento
  setSortOrder(order: 'asc' | 'desc') {
    this.sortOrder = order;
    this.isSortByOpen.set(false);
    this.filteredCategories = this.sortCategories(this.filteredCategories);
  }

  private sortCategories(categories: Category[]): Category[] {
    const direction = this.sortOrder === 'asc' ? 1 : -1;

    return [...categories].sort(
      (a, b) => direction * (a.name || '').localeCompare(b.name || '', 'es', { numeric: true }),
    );
  }
}
