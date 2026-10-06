import { Component, effect, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AddCategoryRequest } from '../models/category.model';
import { CategoryService } from '../services/category-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-category',
  imports: [ReactiveFormsModule],
  templateUrl: './add-category.html',
})
export class AddCategory {
  private router = inject(Router);
  private categoryService = inject(CategoryService);

  constructor() {
    // reacciona al cambio de la signal ejemplo, status, error, idle, loading
    effect(() => {
      const status = this.categoryService.addCategoryStatus();

      if (status === 'success') {
        console.log('La categoría se agregó correctamente.');
        // Limpiar formulario
        this.addCategoryForm.reset();
        this.addCategoryForm.markAsPending();
        this.addCategoryForm.markAsTouched();

        // Redirigir a la lista
        this.router.navigate(['/admin/categories']);
      }

      if (status === 'error') {
        console.error('Error al agregar la categoría.');
      }
    });
  }

  addCategoryForm = new FormGroup({
    name: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(2)],
    }),
    urlHandle: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(2)],
    }),
    description: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.maxLength(150), Validators.minLength(4)],
    }),
    iconUrl: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.maxLength(150)],
    }),
  });

  get nameFormControl() {
    return this.addCategoryForm.controls.name;
  }
  get descriptionFormControl() {
    return this.addCategoryForm.controls.description;
  }
  get urlHandleFormControl() {
    return this.addCategoryForm.controls.urlHandle;
  }
  get iconUrlFormControl() {
    return this.addCategoryForm.controls.iconUrl;
  }

  onSubmit() {
    // Obtener los datos del formulario
    const addCategoryFormValue = this.addCategoryForm.getRawValue();

    // Crear el Dto para enviar al backend,objeto que cumple con la interfaz
    const addCategoryRequestDto: AddCategoryRequest = {
      name: addCategoryFormValue.name,
      urlHandle: addCategoryFormValue.urlHandle,
      iconUrl: addCategoryFormValue.iconUrl,
      description: addCategoryFormValue.description,
    };

    this.categoryService.addCategory(addCategoryRequestDto);
  }
}
