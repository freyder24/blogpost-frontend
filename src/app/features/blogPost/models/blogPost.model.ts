import { Category } from '../../category/models/category.model';

// Datos requeridos para crear un blog post
export interface AddBlogPostRequest {
  title: string;
  slug: string;
  content: string;
  shortDescription: string;
  featuredImageUrl?: string;
  images: string[];
  author?: string;
  isVisible: boolean;
  publishedDate?: string | null;
  categories: string[];
}

// Actualizar blog post
export interface UpdateBlogPostRequest {
  title: string;
  slug: string;
  content: string;
  shortDescription: string;
  featuredImageUrl?: string;
  images: string[];
  author?: string;
  isVisible: boolean;
  publishedDate?: string | null;
  categories: string[];
}

// Datos para mostrar o renderizar un blog post
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  shortDescription: string;
  featuredImageUrl?: string;
  images: string[];
  author?: string;
  isVisible: boolean;
  publishedDate?: string | null;
  categories: Category[];
}
