import { Component, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { OnInit } from '@angular/core';
import { take } from 'rxjs';
import { RouterLink } from '@angular/router';
import { BlogPost } from '../models/blogPost.model';
import { BlogPostService } from '../services/blogpost-service';

@Component({
  selector: 'app-blogpost-list',
  imports: [RouterLink, DatePipe],
  templateUrl: './blogpost-list.html',
})
export class BlogpostList implements OnInit {
  private blogPostService = inject(BlogPostService);
  private getAllBlogPostsServiceRef = this.blogPostService.getAllBlogPosts();

  isLoading = this.getAllBlogPostsServiceRef.isLoading;
  isError = this.getAllBlogPostsServiceRef.error;
  valueBlogPosts = this.getAllBlogPostsServiceRef.value;

  isSortByOpen = signal(false);
  sortBy = 'Más reciente';
  searchTerm = '';
  visibilityFilter: 'all' | 'visible' | 'hidden' = 'all';
  currentPage = 1;
  pageSize = 10;
  totalCount = signal<number | undefined>(undefined);

  ngOnInit(): void {
  // Carga el total que entrega el API.
    this.blogPostService
      .getBlogPostCount()
      .pipe(take(1))
      .subscribe({
        next: (count) => this.totalCount.set(count),
      });
  }
  // Filtra y ordena los posts antes de mostrarlos.
  get filteredBlogPosts(): BlogPost[] {
    const query = this.searchTerm.trim().toLocaleLowerCase('es');
    return (this.valueBlogPosts() ?? [])
      .filter((post) => {
        const matchesVisibility =
          this.visibilityFilter === 'all' ||
          (this.visibilityFilter === 'visible' ? post.isVisible : !post.isVisible);
        const text =
          `${post.title} ${post.shortDescription} ${post.author ?? ''} ${post.slug}`.toLocaleLowerCase(
            'es',
          );
        return matchesVisibility && (!query || text.includes(query));
      })
      .sort((a, b) => this.comparePosts(a, b));
  }

  get pageBlogPosts(): BlogPost[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredBlogPosts.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.filteredBlogPosts.length / this.pageSize));
  }

  get firstItem(): number {
    return this.filteredBlogPosts.length ? (this.currentPage - 1) * this.pageSize + 1 : 0;
  }

  get lastItem(): number {
    return Math.min(this.currentPage * this.pageSize, this.filteredBlogPosts.length);
  }

  get visibleCount(): number {
    return (this.valueBlogPosts() ?? []).filter((post) => post.isVisible).length;
  }

  get hiddenCount(): number {
    return (this.valueBlogPosts() ?? []).filter((post) => !post.isVisible).length;
  }

  toggleSortBy(): void {
    this.isSortByOpen.update((open) => !open);
  }
  // Actualiza la busqueda y vuelve a la primera pagina.
  setSearch(query: string): void {
    this.searchTerm = query;
    this.currentPage = 1;
  }

  // Cambia el filtro por visibilidad.
  setVisibility(filter: 'all' | 'visible' | 'hidden'): void {
    this.visibilityFilter = filter;
    this.currentPage = 1;
  }
  // Aplica el orden elegido y cierra el menu.
  setSort(sort: string): void {
    this.sortBy = sort;
    this.isSortByOpen.set(false);
    this.currentPage = 1;
  }
  // Limita la navegacion a las paginas disponibles.
  setPage(page: number): void {
    this.currentPage = Math.min(Math.max(1, page), this.totalPages);
  }
  // Cambia el tamanio de pagina.
  setPageSize(size: number): void {
    this.pageSize = size;
    this.currentPage = 1;
  }
  // Compara posts segun el orden elegido.
  private comparePosts(a: BlogPost, b: BlogPost): number {
    if (this.sortBy === 'Título A-Z' || this.sortBy === 'Título Z-A') {
      const direction = this.sortBy === 'Título A-Z' ? 1 : -1;
      return direction * a.title.localeCompare(b.title, 'es', { numeric: true });
    }

    const dateA = a.publishedDate ? new Date(a.publishedDate).getTime() : 0;
    const dateB = b.publishedDate ? new Date(b.publishedDate).getTime() : 0;
    return this.sortBy === 'Más antiguo' ? dateA - dateB : dateB - dateA;
  }
  // Recarga los posts desde el servicio.
  reload(): void {
    this.getAllBlogPostsServiceRef.reload();
  }
}


