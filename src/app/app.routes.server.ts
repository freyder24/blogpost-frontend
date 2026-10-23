import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  // Rutas con parametro :id se renderizan en el navegador (cargan datos desde la API)
  {
    path: 'admin/categories/edit/:id',
    renderMode: RenderMode.Client,
  },
  {
    path: 'admin/blogposts/edit/:id',
    renderMode: RenderMode.Client,
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];
