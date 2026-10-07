// Datos requeridos para crear una categoria
export interface AddCategoryRequest {
  name: string;
  urlHandle: string;
  description?: string;
  iconUrl?: string;
}

//Actualizar categoria
export interface UpdateCategoryRequest {
  name: string;
  urlHandle: string;
  description?: string;
  iconUrl?: string;
}

// Datos para mostrar o trenderizar categoria
export interface Category {
  id: string;
  name: string;
  urlHandle: string;
  description?: string;
  iconUrl?: string;
}
