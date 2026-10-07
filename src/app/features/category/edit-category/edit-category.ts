import { Component, effect, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { CategoryService } from '../services/category-service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UpdateCategoryRequest } from '../models/category.model';

@Component({
  selector: 'app-edit-category',
  imports: [ReactiveFormsModule],
  templateUrl: './edit-category.html',
})
export class EditCategory {
  // ID recibido desde la ruta
  id = input<string>();
  private router = inject(Router);
  private categoryService = inject(CategoryService);
  categoryResourceRef = this.categoryService.getCategoryById(this.id);

  constructor() {
    effect(() => {
      const category = this.categoryResourceRef.value();
      if (category) {
        this.editCategoryForm.patchValue({
          name: category.name,
          urlHandle: category.urlHandle,
          description: category.description ?? '',
          iconUrl: category.iconUrl ?? '',
        });
      }
    });

    effect(() => {
      const status = this.categoryService.updateCategoryStatus();

      if (status === 'success') {
        console.log('La categoría se actualizó correctamente.');
        this.router.navigate(['/admin/categories']);
      }

      if (status === 'error') {
        console.error('Error al actualizar la categoría.');
      }
    });
  }

  editCategoryForm = new FormGroup({
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
    return this.editCategoryForm.controls.name;
  }
  get descriptionFormControl() {
    return this.editCategoryForm.controls.description;
  }
  get urlHandleFormControl() {
    return this.editCategoryForm.controls.urlHandle;
  }
  get iconUrlFormControl() {
    return this.editCategoryForm.controls.iconUrl;
  }

  onSubmit() {
    const id = this.id();
    // Salir si el formulario es invalido o no hay id
    if (this.editCategoryForm.invalid || !id) {
      return;
    }

    // Obtener los valores del formulario.
    const formValueReaw = this.editCategoryForm.getRawValue();

    const updateCategoryRequestDto: UpdateCategoryRequest = {
      name: formValueReaw.name,
      urlHandle: formValueReaw.urlHandle,
      description: formValueReaw.description,
      iconUrl: formValueReaw.iconUrl,
    };

    this.categoryService.updateCategoryById(id, updateCategoryRequestDto);
  }

  deleteCategory() {
    const id = this.id();
    if (!id) return;

    this.categoryService.deleteCategory(id).subscribe({
      next: () => {
        this.router.navigate(['/admin/categories']);
      },
      error: () => {
        console.log('Ocurrió un error en el servidor. Inténtalo nuevamente más tarde.');
      },
    });
  }
}
