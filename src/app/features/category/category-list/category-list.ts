import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CategoryService } from '../services/category-service';
import { Category } from '../models/category.model';

@Component({
  selector: 'app-category-list',
  imports: [RouterLink],
  templateUrl: './category-list.html',
})
export class CategoryList implements OnInit {
  private categoryService = inject(CategoryService);

  private readonly sortField = 'name';
  sortOrder: 'asc' | 'desc' = 'asc';
  private searchTerm = '';
  currentPage = 1;
  pageSize = 10;

  isError = signal(false);
  isLoading = signal(true);
  isSortByOpen = signal(false);

  filteredCategories: Category[] = [];

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.filteredCategories.length / this.pageSize));
  }

  get pageCategories(): Category[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredCategories.slice(start, start + this.pageSize);
  }

  get firstItem(): number {
    return this.filteredCategories.length === 0 ? 0 : (this.currentPage - 1) * this.pageSize + 1;
  }

  get lastItem(): number {
    return Math.min(this.currentPage * this.pageSize, this.filteredCategories.length);
  }

  // Variable para almacenar el total de categorias
  totalCount?: number;

  ngOnInit() {
    this.loadCategories();

    // Obtener el total de categorias
    this.categoryService.getCategoryCount().subscribe({
      next: (value) => {
        this.totalCount = value;
      },
      error: () => {
        this.totalCount = this.filteredCategories.length;
      },
    });
  }

  // Cargar categorias desde el backend
  loadCategories(query?: string) {
    this.isLoading.set(true);
    this.isError.set(false);
    this.categoryService.getAllCategories(query, this.sortField, this.sortOrder).subscribe({
      next: (categories) => {
        this.filteredCategories = this.sortCategories(categories);
        this.totalCount ??= categories.length;
        this.currentPage = 1;
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
    this.currentPage = 1;
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
    this.currentPage = 1;
  }

  // Manejar el cambio de pagina
  setPage(page: number): void {
    this.currentPage = Math.min(Math.max(1, page), this.totalPages);
  }

  setPageSize(size: number): void {
    this.pageSize = size;
    this.currentPage = 1;
  }

  private sortCategories(categories: Category[]): Category[] {
    const direction = this.sortOrder === 'asc' ? 1 : -1;

    return [...categories].sort(
      (a, b) => direction * (a.name || '').localeCompare(b.name || '', 'es', { numeric: true }),
    );
  }
}
