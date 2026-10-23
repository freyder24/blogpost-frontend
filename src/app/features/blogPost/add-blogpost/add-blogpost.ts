import { ChangeDetectorRef, Component, effect, inject } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AddBlogPostRequest } from '../models/blogPost.model';
import { BlogPostService } from '../services/blogpost-service';
import { CategoryService } from '../../category/services/category-service';
import { MarkdownComponent } from 'ngx-markdown';
import { ImageSelector } from '../image-selector/image-selector';
import { ImageUploadService } from '../services/image-upload.service';

@Component({
  selector: 'app-add-blogpost',
  imports: [ReactiveFormsModule, RouterLink, MarkdownComponent, ImageSelector],
  templateUrl: './add-blogpost.html',
})
export class AddBlogpost {
  private router = inject(Router);
  private blogPostService = inject(BlogPostService);
  // Necesario para reflejar la URL elegida en el preview con deteccion zoneless
  private cdr = inject(ChangeDetectorRef);
  //Inyectamos categoria para seleccionar tipo de categoria al que pertenecera el blog post
  private categoryService = inject(CategoryService);
  // Popup para elegir imagen desde el computador o pegando una URL
  private imageUploadService = inject(ImageUploadService);

  // Obtenemos todas las categorias desde el backend
  private getAllCategoriesRef = this.categoryService.getAllCategories();

  categories = this.getAllCategoriesRef.value;
  isLoadingCategories = this.getAllCategoriesRef.isLoading;
  isErrorCategories = this.getAllCategoriesRef.error;

  constructor() {
    // reacciona al cambio de la signal idle, loading, error, success
    effect(() => {
      const status = this.blogPostService.addBlogPostStatus();

      if (status === 'success') {
        console.log('El blog post se agregó correctamente.');
        // Limpiar formulario
        this.addBlogPostForm.reset();

        // Redirigir a la lista
        this.router.navigate(['/admin/blogposts']);
      }

      if (status === 'error') {
        console.error('Error al agregar el blog post.');
      }
    });
  }

  addBlogPostForm = new FormGroup({
    title: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(5), Validators.maxLength(200)],
    }),
    slug: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.pattern(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)],
    }),
    shortDescription: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(160)],
    }),
    content: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(20)],
    }),
    featuredImageUrl: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.maxLength(500)],
    }),
    images: new FormArray<FormControl<string>>([]),
    author: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.maxLength(100)],
    }),
    isVisible: new FormControl<boolean>(false, { nonNullable: true }),
    publishedDate: new FormControl<string>('', { nonNullable: true }),
    categories: new FormArray<FormControl<string>>([]),
  });

  //  Getters para el manejo del template mucho mas facil
  get titleFormControl() {
    return this.addBlogPostForm.controls.title;
  }
  get slugFormControl() {
    return this.addBlogPostForm.controls.slug;
  }
  get shortDescriptionFormControl() {
    return this.addBlogPostForm.controls.shortDescription;
  }
  get contentFormControl() {
    return this.addBlogPostForm.controls.content;
  }
  get featuredImageUrlFormControl() {
    return this.addBlogPostForm.controls.featuredImageUrl;
  }
  get authorFormControl() {
    return this.addBlogPostForm.controls.author;
  }
  get imagesArray() {
    return this.addBlogPostForm.controls.images;
  }
  get categoriesArray() {
    return this.addBlogPostForm.controls.categories;
  }

  // Abre el popup de seleccion de imagen y aplica la URL elegida al campo indicado
  openImageSelector(target: 'featured' | number) {
    const title = target === 'featured' ? 'Imagen destacada' : 'Imagen de galería';

    this.imageUploadService.openPopup(title, (url) => {
      if (target === 'featured') {
        this.featuredImageUrlFormControl.setValue(url);
      } else {
        this.imagesArray.at(target)?.setValue(url);
      }
      // setValue no programa deteccion de cambios en modo zoneless
      this.cdr.markForCheck();
    });
  }

  //  Imagenes dinamicas
  addImage(url = '') {
    this.imagesArray.push(new FormControl<string>(url, { nonNullable: true }));
  }
  removeImage(index: number) {
    this.imagesArray.removeAt(index);
  }

  //  Categorias dinamicas
  addCategory(categoryId: string) {
    if (!categoryId) {
      return;
    }
    const exists = this.categoriesArray.controls.some((control) => control.value === categoryId);
    if (exists) {
      return;
    }
    this.categoriesArray.push(new FormControl<string>(categoryId, { nonNullable: true }));
  }
  removeCategory(index: number) {
    this.categoriesArray.removeAt(index);
  }

  // Devuelve el nombre de una categoria a partir de su id
  getCategoryName(categoryId: string) {
    return this.categories()?.find((category) => category.id === categoryId)?.name ?? categoryId;
  }

  //  Slug automatico a partir del titulo
  generateSlug() {
    const slug = this.addBlogPostForm.controls.title.value
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-');

    this.addBlogPostForm.controls.slug.setValue(slug);
  }

  onSubmit() {
    // Salir si el formulario es invalido
    if (this.addBlogPostForm.invalid) {
      this.addBlogPostForm.markAllAsTouched();
      return;
    }

    // Obtener los valores del formulario
    const formValueRaw = this.addBlogPostForm.getRawValue();

    // Crear el Dto para enviar al backend, objeto que cumple con la interfaz
    const addBlogPostRequestDto: AddBlogPostRequest = {
      title: formValueRaw.title.trim(),
      slug: formValueRaw.slug.trim(),
      content: formValueRaw.content.trim(),
      shortDescription: formValueRaw.shortDescription.trim(),
      featuredImageUrl: formValueRaw.featuredImageUrl.trim() || undefined,
      images: formValueRaw.images.map((url) => url.trim()).filter(Boolean),
      author: formValueRaw.author.trim() || undefined,
      isVisible: formValueRaw.isVisible,
      publishedDate: formValueRaw.publishedDate
        ? new Date(formValueRaw.publishedDate).toISOString()
        : null,
      categories: formValueRaw.categories,
    };

    this.blogPostService.addBlogPost(addBlogPostRequestDto);
  }
}
