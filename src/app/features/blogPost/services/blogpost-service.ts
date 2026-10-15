import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Injectable, InputSignal, signal } from '@angular/core';
import { AddBlogPostRequest, BlogPost, UpdateBlogPostRequest } from '../models/blogPost.model';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class BlogPostService {
  private http = inject(HttpClient);
  private apiBaseUrl = environment.apiBaseUrl;

  // Tiempo maximo de espera en ms antes de abortar la peticion al servidor.
  private requestTimeout = 10000;

  //Estado de blogpost
  addBlogPostStatus = signal<'idle' | 'loading' | 'error' | 'success'>('idle');
  updateBlogPostStatus = signal<'idle' | 'loading' | 'error' | 'success'>('idle');

  // Crear blog post
  addBlogPost(blogPost: AddBlogPostRequest) {
    this.addBlogPostStatus.set('loading');
    this.http.post<BlogPost>(`${this.apiBaseUrl}/api/BlogPosts`, blogPost).subscribe({
      next: () => {
        this.addBlogPostStatus.set('success');
      },
      error: () => {
        this.addBlogPostStatus.set('error');
      },
    });
  }

  // Obtener todos los blog posts
  getAllBlogPosts() {
    return httpResource<BlogPost[]>(() => ({
      url: `${this.apiBaseUrl}/api/BlogPosts`,
      timeout: this.requestTimeout,
    }));
  }

  // Obtener detalle de blog post por id
  getBlogPostById(id: InputSignal<string | undefined>) {
    return httpResource<BlogPost>(() => {
      const blogPostId = id();

      if (!blogPostId) {
        return undefined;
      }

      return {
        url: `${this.apiBaseUrl}/api/BlogPosts/${blogPostId}`,
        timeout: this.requestTimeout,
      };
    });
  }

  // Actualizar blog post
  updateBlogPostById(id: string, updateBlogPostRequestDto: UpdateBlogPostRequest) {
    this.updateBlogPostStatus.set('loading');
    this.http
      .put<BlogPost>(`${this.apiBaseUrl}/api/BlogPosts/${id}`, updateBlogPostRequestDto)
      .subscribe({
        next: () => {
          this.updateBlogPostStatus.set('success');
        },
        error: () => {
          this.updateBlogPostStatus.set('error');
        },
      });
  }

  // Eliminar blog post
  deleteBlogPostById(id: string) {
    return this.http.delete<BlogPost>(`${this.apiBaseUrl}/api/BlogPosts/${id}`);
  }
}
