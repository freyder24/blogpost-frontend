import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BlogPostService } from '../../blogPost/services/blogpost-service';
import { BlogPostCard } from '../../../core/components/blog-post-card/blog-post-card';

@Component({
  selector: 'app-home',
  imports: [BlogPostCard, FormsModule],
  templateUrl: './home.html',
})
export class Home {
  private blogPostService = inject(BlogPostService);
  private blogPostServiceRef = this.blogPostService.getAllBlogPosts();

  isLoading = this.blogPostServiceRef.isLoading;
  error = this.blogPostServiceRef.error;
  blogPosts = this.blogPostServiceRef.value;

  searchTerm = signal('');

  filteredBlogPosts = computed(() => {
    const posts = this.blogPosts() ?? [];
    const term = this.searchTerm().toLowerCase().trim();

    if (!term) {
      return posts;
    }

    return posts.filter((post) => {
      const title = post.title?.toLowerCase() ?? '';
      const description = post.shortDescription?.toLowerCase() ?? '';
      const content = post.content?.toLowerCase() ?? '';

      return title.includes(term) || description.includes(term) || content.includes(term);
    });
  });
}
