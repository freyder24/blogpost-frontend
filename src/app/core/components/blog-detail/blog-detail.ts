import { DatePipe } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { MarkdownComponent } from 'ngx-markdown';
import { BlogPostService } from '../../../features/blogPost/services/blogpost-service';

@Component({
  selector: 'app-blog-detail',
  imports: [DatePipe, MarkdownComponent],
  templateUrl: './blog-detail.html',
})
export class BlogDetail {
  //Injectamos servcio de blogpost por lo que quweremos mostrar detalle
  private blogPostService = inject(BlogPostService);

  // urlhadnle o slug para mostrar detalle blogpost
  slug = input.required<string | undefined>();
  // Obtener la referencia
  private blogPostServiceRef = this.blogPostService.getBlogPostBySlug(this.slug);
  blogPostResponse = this.blogPostServiceRef.value;

  //Estado para el frontend
  isLoading = this.blogPostServiceRef.isLoading;
  error = this.blogPostServiceRef.error;

  // Mostrar las imagenes adicionales
  galleryImages = computed(() => {
    const blogPost = this.blogPostResponse();
    return (blogPost?.images ?? []).filter((url) => url && url !== blogPost?.featuredImageUrl);
  });
}
