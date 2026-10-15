import {
  ApplicationConfig,
  LOCALE_ID,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideMarkdown } from 'ngx-markdown';

import { routes } from './app.routes';

// Registra los datos de localizacion en espanol para pipes de fecha, moneda, etc.
registerLocaleData(localeEs, 'es');

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    // Configuracion del sistema de rutas de la aplicacion
    provideRouter(routes, withComponentInputBinding()),
    // registrar HttpClient a nivel de app.
    provideHttpClient(),
    provideMarkdown(),
    // Locale por defecto de la aplicacion espanol.
    { provide: LOCALE_ID, useValue: 'es' },
  ],
};
