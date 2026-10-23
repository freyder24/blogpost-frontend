// Forma de la respuesta que devuelve ImagesController.
export interface ImageUploadResponse {
  id: string;
  fileName: string;
  fileExtension: string;
  title: string;
  url: string;
  createdDate: string;
}
