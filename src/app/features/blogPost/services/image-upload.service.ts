import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { ImageUploadResponse } from '../models/image.model';

@Injectable({
  providedIn: 'root',
})
export class ImageUploadService {
  private http = inject(HttpClient);
  private apiBaseUrl = environment.apiBaseUrl;

  // Controla la visibilidad del popup
  showImageSelector = signal<boolean>(false);
  // Titulo que muestra el popup
  title = signal<string>('Seleccionar imagen');

  // Callback que recibe la URL elegida, lo define la pagina que abre el popup
  private onSelectPopup: ((url: string) => void) | null = null;

  // Abre el popup y entrega la imagen elegida al callback
  openPopup(title: string, onSelectPopup: (url: string) => void) {
    this.title.set(title);
    this.onSelectPopup = onSelectPopup;
    this.showImageSelector.set(true);
  }

  // Entrega la URL seleccionada y cierra el popup
  confirmPopup(url: string) {
    this.onSelectPopup?.(url);
    this.closePopup();
  }

  // Cierra el popup sin entregar nada
  closePopup() {
    this.showImageSelector.set(false);
    this.onSelectPopup = null;
  }

  // La API recibe estos tres campos y responde un objeto que contiene la url.
  upload(file: File, fileName: string, title: string) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileName', fileName);
    formData.append('title', title);

    return this.http.post<ImageUploadResponse>(`${this.apiBaseUrl}/api/Images`, formData);
  }

  // Consulta las imagenes guardadas en GET All images
  getAllImages(enabled: () => boolean) {
    return httpResource<ImageUploadResponse[]>(() =>
      enabled() ? { url: `${this.apiBaseUrl}/api/Images` } : undefined,
    );
  }
}
