import { Component, Input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BlogPost } from '../../../features/blogPost/models/blogPost.model';
import { TruncatePipe } from '../../pipes/truncate-pipe';

@Component({
  selector: 'app-blog-post-card',
  imports: [DatePipe, RouterLink, TruncatePipe],
  templateUrl: './blog-post-card.html',
  styleUrl: './blog-post-card.css',
})
export class BlogPostCard {
  // Propiedad que biene del valor padre
  @Input({ required: true }) blogPost!: BlogPost;
}
