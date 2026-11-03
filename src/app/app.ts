import { Component, effect, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './core/components/navbar/navbar';
import { Footer } from './core/components/footer/footer';
import { AuthService } from './features/auth/services/auth-service';

export interface Beach {
  id: number;
  name: string;
  region: string;
  country: string;
  countryFlag: string;
  temperature: number;
  image: string;
  tags: string[];
  description: string;
  feature: string;
  featureIcon: string;
}

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, Footer],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('Travel América Latina');

  authService = inject(AuthService);

  // Recurso HTTP que consulta el usuario autenticado en el backend al cargar la aplicacion.
  authenticatedUserResource = this.authService.loadUser();

  // Valor reactivo devuelto por el recurso: el usuario autenticado o undefined si no hay sesion.
  authenticatedUser = this.authenticatedUserResource.value;

  // Sincroniza el usuario obtenido de la API con el signal compartido de AuthService,
  // para que el navbar y demas componentes mantengan la sesion al recargar la pagina.
  syncAuthenticatedUserEffect = effect(() => {
    const currentUser = this.authenticatedUser();
    this.authService.setUser(currentUser ?? null);
  });
}
