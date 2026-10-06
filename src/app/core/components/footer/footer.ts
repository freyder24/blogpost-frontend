import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  imports: [],
  templateUrl: './footer.html',
})
export class Footer {
  readonly year = new Date().getFullYear();
  regions = ['Sudamérica', 'Centroamérica', 'Caribe'];
  categories = [
    'Playas & Costas',
    'Naturaleza',
    'Aventura Extrema',
    'Cultura & Patrimonio',
    'Gastronomía',
  ];
  legalLinks = ['Privacidad', 'Términos y condiciones', 'Contacto'];
}
