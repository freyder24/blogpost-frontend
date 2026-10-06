import { Component, effect, inject, input } from '@angular/core';
import { CategoryService } from '../services/category-service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit-category',
  imports: [ReactiveFormsModule],
  templateUrl: './edit-category.html',
})
export class EditCategory {
  id = input<string>();
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
    console.log(this.editCategoryForm.getRawValue());
  }
}
