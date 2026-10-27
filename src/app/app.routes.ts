import { Routes } from '@angular/router';
import { CategoryList } from './features/category/category-list/category-list';
import { AddCategory } from './features/category/add-category/add-category';
import { EditCategory } from './features/category/edit-category/edit-category';
import { BlogpostList } from './features/blogPost/blogpost-list/blogpost-list';
import { AddBlogpost } from './features/blogPost/add-blogpost/add-blogpost';
import { EditBlogpost } from './features/blogPost/edit-blogpost/edit-blogpost';
import { Home } from './features/public/home/home';
import { BlogDetail } from './core/components/blog-detail/blog-detail';

export const routes: Routes = [
  // Ruta por defecto,home
  {
    path: '',
    pathMatch: 'full',
    component: Home,
  },
  {
    path: 'blog/:slug',
    component: BlogDetail,
  },

  // categoria
  {
    path: 'admin/categories',
    component: CategoryList,
  },
  {
    path: 'admin/categories/add',
    component: AddCategory,
  },
  {
    path: 'admin/categories/edit/:id',
    component: EditCategory,
  },

  // blog post
  {
    path: 'admin/blogposts',
    component: BlogpostList,
  },
  {
    path: 'admin/blogposts/add',
    component: AddBlogpost,
  },
  {
    path: 'admin/blogposts/edit/:id',
    component: EditBlogpost,
  },

  // Ruta comodin para rutas inexistentes
  {
    path: '**',
    redirectTo: 'admin/blogposts',
  },
];
