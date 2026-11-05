import { Routes } from '@angular/router';
import { CategoryList } from './features/category/category-list/category-list';
import { AddCategory } from './features/category/add-category/add-category';
import { EditCategory } from './features/category/edit-category/edit-category';
import { BlogpostList } from './features/blogPost/blogpost-list/blogpost-list';
import { AddBlogpost } from './features/blogPost/add-blogpost/add-blogpost';
import { EditBlogpost } from './features/blogPost/edit-blogpost/edit-blogpost';
import { Home } from './features/public/home/home';
import { BlogDetail } from './core/components/blog-detail/blog-detail';
import { Login } from './features/auth/login/login';
import { Register } from './features/auth/register/register';
import { adminGuard } from './features/auth/guards/admin-guard';

export const routes: Routes = [
  // Ruta por defecto,home
  {
    path: '',
    pathMatch: 'full',
    component: Home,
  },

  // auth
  {
    path: 'login',
    component: Login,
  },
  {
    path: 'register',
    component: Register,
  },

  {
    path: 'blog/:slug',
    component: BlogDetail,
  },

  // categoria
  {
    path: 'admin/categories',
    component: CategoryList,
    canActivate: [adminGuard],
  },
  {
    path: 'admin/categories/add',
    component: AddCategory,
    canActivate: [adminGuard],
  },
  {
    path: 'admin/categories/edit/:id',
    component: EditCategory,
    canActivate: [adminGuard],
  },

  // blog post
  {
    path: 'admin/blogposts',
    component: BlogpostList,
    canActivate: [adminGuard],
  },
  {
    path: 'admin/blogposts/add',
    component: AddBlogpost,
    canActivate: [adminGuard],
  },
  {
    path: 'admin/blogposts/edit/:id',
    component: EditBlogpost,
    canActivate: [adminGuard],
  },

  // Ruta comodin para rutas inexistentes
  {
    path: '**',
    redirectTo: 'admin/blogposts',
  },
];
