import { Component, effect, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ImageUploadService } from '../services/image-upload.service';

@Component({
  selector: 'app-image-selector',
  imports: [ReactiveFormsModule],
  templateUrl: './image-selector.html',
})
export class ImageSelector {
  private imageUploadService = inject(ImageUploadService);

  // El formulario guarda los datos que se enviaran como multipart/form-data.
  imageSelectorUploadForm = new FormGroup({
    file: new FormControl<File | null>(null, Validators.required),
    fileName: new FormControl('', { nonNullable: true }),
    title: new FormControl('', { nonNullable: true }),
    url: new FormControl('', { nonNullable: true }),
  });

  // Estado del popup y el titulo que se enviara como metadato a la API.
  showImageSelectorService = this.imageUploadService.showImageSelector.asReadonly();
  title = this.imageUploadService.title.asReadonly();
  // Galeria cargada desde el endpoint GET /api/Images.
  images = this.imageUploadService.getAllImages(() => this.showImageSelectorService());
  // Estado de carga
  isLoading = this.images.isLoading;

  // Archivo elegido desde el computador
  error = signal<string>('');
  file = signal<File | null>(null);
  filePreview = signal<string>('');
  isUploading = signal<boolean>(false);

  constructor() {
    effect(() => {
      const selectedFile = this.file();
      if (selectedFile) {
        console.log('Imagen seleccionada:', selectedFile.name);
      }
    });
  }

  // Seleccionar desde el computador
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      this.setFile(file);
    }
    input.value = '';
  }

  onFileDrop(event: DragEvent) {
    event.preventDefault();
    const file = event.dataTransfer?.files?.[0];
    if (file) {
      this.setFile(file);
    }
  }

  clearFile() {
    URL.revokeObjectURL(this.filePreview());
    this.file.set(null);
    this.filePreview.set('');
    this.imageSelectorUploadForm.controls.file.setValue(null);
    this.imageSelectorUploadForm.controls.fileName.setValue('');
  }

  // Decidir opcion usar para subir el archivo o confirmar la URL.
  confirm() {
    this.error.set('');

    if (this.file()) {
      this.uploadImageSelectedFile();
      return;
    }

    this.useImageUrl();
  }

  // Valida la URL pegada y la devuelve al formulario que abrio el selector.
  private useImageUrl() {
    const url = this.imageSelectorUploadForm.controls.url.value.trim();
    if (!url) {
      this.error.set('Selecciona una imagen del computador o pega una URL.');
      return;
    }
    this.finish(url);
  }

  // Devuelve al formulario padre la URL de una imagen ya guardada.
  selectExistingImage(url: string) {
    this.finish(url);
  }

  // Envia el archivo y sus metadatos a la API, usa la URL que responde.
  private uploadImageSelectedFile() {
    const file = this.file();
    if (!file) return;

    this.isUploading.set(true);
    this.imageUploadService
      .upload(
        file,
        this.imageSelectorUploadForm.controls.fileName.value,
        this.imageSelectorUploadForm.controls.title.value,
      )
      .subscribe({
        next: (response) => {
          this.isUploading.set(false);
          this.finish(response.url);
          console.log(response);
        },
        error: (error) => {
          console.log('Error al subir imagen:', error);
          this.isUploading.set(false);
          this.error.set(
            'No se pudo subir la imagen. Revisa el formato, el tamaño y la conexión con la API.',
          );
        },
      });
  }

  cancel() {
    this.reset();
    this.imageUploadService.closePopup();
  }

  private setFile(file: File) {
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif'];
    const extension = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();

    // Mantiene las mismas reglas de formato y tamaño del controlador ASP.NET.
    if (!file.type.startsWith('image/') || !allowedExtensions.includes(extension)) {
      this.error.set('Formatos permitidos: JPG, PNG o GIF.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      this.error.set('La imagen no puede superar los 10 MB.');
      return;
    }

    this.error.set('');
    this.clearFile();
    this.file.set(file);
    this.filePreview.set(URL.createObjectURL(file));
    this.imageSelectorUploadForm.controls.url.setValue('');
    this.imageSelectorUploadForm.controls.fileName.setValue(file.name);
    this.imageSelectorUploadForm.controls.title.setValue(this.title());
    this.imageSelectorUploadForm.controls.file.setValue(file);
  }

  private finish(url: string) {
    this.imageUploadService.confirmPopup(url);
    this.reset();
  }

  private reset() {
    this.clearFile();
    this.imageSelectorUploadForm.reset({
      file: null,
      fileName: '',
      title: '',
      url: '',
    });
    this.error.set('');
    this.isUploading.set(false);
  }
}
