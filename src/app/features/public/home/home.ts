import { Component, inject } from '@angular/core';
import { BlogPostService } from '../../blogPost/services/blogpost-service';
import { BlogPostCard } from '../../../core/components/blog-post-card/blog-post-card';

@Component({
  selector: 'app-home',
  imports: [BlogPostCard],
  templateUrl: './home.html',
})
export class Home {
  private blogPostService = inject(BlogPostService);
  private blogPostServiceRef = this.blogPostService.getAllBlogPosts();

  isLoading = this.blogPostServiceRef.isLoading;
  error = this.blogPostServiceRef.error;
  blogPosts = this.blogPostServiceRef.value;
}
