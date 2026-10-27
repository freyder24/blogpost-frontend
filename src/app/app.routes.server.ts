import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  // Home consulta la API en el navegador para evitar bloquear el render SSR.
  {
    path: '',
    renderMode: RenderMode.Client,
  },
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
    path: 'blog/:slug',
    renderMode: RenderMode.Client,
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];
