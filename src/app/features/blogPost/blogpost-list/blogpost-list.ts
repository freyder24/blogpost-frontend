import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BlogPostService } from '../services/blogpost-service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-blogpost-list',
  imports: [RouterLink, DatePipe],
  templateUrl: './blogpost-list.html',
})
export class BlogpostList {
  private blogPostService = inject(BlogPostService);
  private getAllBlogPostsServiceRef = this.blogPostService.getAllBlogPosts();

  isLoading = this.getAllBlogPostsServiceRef.isLoading;
  isError = this.getAllBlogPostsServiceRef.error;
  valueBlogPosts = this.getAllBlogPostsServiceRef.value;

  reload() {
    this.getAllBlogPostsServiceRef.reload();
  }
}
