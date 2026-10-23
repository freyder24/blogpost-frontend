import { ChangeDetectorRef, Component, effect, inject, input } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MarkdownComponent } from 'ngx-markdown';
import { BlogPostService } from '../services/blogpost-service';
import { UpdateBlogPostRequest } from '../models/blogPost.model';
import { CategoryService } from '../../category/services/category-service';
import { ImageSelector } from '../image-selector/image-selector';
import { ImageUploadService } from '../services/image-upload.service';

@Component({
  selector: 'app-edit-blogpost',
  imports: [ReactiveFormsModule, RouterLink, MarkdownComponent, ImageSelector],
  templateUrl: './edit-blogpost.html',
})
export class EditBlogpost {
  // Id recivido de la ruta
  id = input<string>();
  private blogPostService = inject(BlogPostService);
  // Inyectamos categoria para el selector de categorias
  private categoryService = inject(CategoryService);

  private router = inject(Router);
  // Necesario para reflejar la URL elegida en el preview con deteccion zoneless
  private cdr = inject(ChangeDetectorRef);
  // Popup para elegir imagen desde el computador o pegando una URL
  private imageUploadService = inject(ImageUploadService);

  // Blog post que se esta editando
  blogPostResourceRef = this.blogPostService.getBlogPostById(this.id);

  // Categorias disponibles para asignar
  private getAllCategoriesRef = this.categoryService.getAllCategories();
  categories = this.getAllCategoriesRef.value;
  isLoadingCategories = this.getAllCategoriesRef.isLoading;
  isErrorCategories = this.getAllCategoriesRef.error;

  editBlogPostForm = new FormGroup({
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

  // Cargar los datos del post en el formulario cuando llegan del backend
  constructor() {
    effect(() => {
      const blogPost = this.blogPostResourceRef.value();
      if (!blogPost) return;

      this.editBlogPostForm.patchValue({
        title: blogPost.title,
        slug: blogPost.slug,
        shortDescription: blogPost.shortDescription,
        content: blogPost.content,
        featuredImageUrl: blogPost.featuredImageUrl ?? '',
        author: blogPost.author ?? '',
        isVisible: blogPost.isVisible,
        // Convertimos la fecha ISO al formato que acepta datetime-local
        publishedDate: this.toDateTimeLocal(blogPost.publishedDate),
      });

      // Rellenar el array de imagenes
      this.imagesArray.clear();
      blogPost.images.forEach((img) => {
        this.imagesArray.push(new FormControl(img, { nonNullable: true }));
      });

      // Rellenar el array de categorias (el backend devuelve objetos Category)
      this.categoriesArray.clear();
      blogPost.categories.forEach((cat) => {
        this.categoriesArray.push(new FormControl(cat.id, { nonNullable: true }));
      });
    });

    // Redirigir a la lista cuando la actualizacion sea exitosa
    effect(() => {
      const status = this.blogPostService.updateBlogPostStatus();

      if (status === 'success') {
        this.router.navigate(['/admin', 'blogposts']);
      }
    });
  }

  //  Getters para el manejo del template mucho mas facil
  get titleFormControl() {
    return this.editBlogPostForm.controls.title;
  }
  get slugFormControl() {
    return this.editBlogPostForm.controls.slug;
  }
  get shortDescriptionFormControl() {
    return this.editBlogPostForm.controls.shortDescription;
  }
  get contentFormControl() {
    return this.editBlogPostForm.controls.content;
  }
  get featuredImageUrlFormControl() {
    return this.editBlogPostForm.controls.featuredImageUrl;
  }
  get authorFormControl() {
    return this.editBlogPostForm.controls.author;
  }
  get imagesArray() {
    return this.editBlogPostForm.controls.images;
  }
  get categoriesArray() {
    return this.editBlogPostForm.controls.categories;
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
    const slug = this.editBlogPostForm.controls.title.value
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-');

    this.editBlogPostForm.controls.slug.setValue(slug);
  }

  // Convierte una fecha ISO a formato datetime local, YYYY-MM-DDTHH:mm
  private toDateTimeLocal(date?: string | null) {
    if (!date) return '';
    const d = new Date(date);
    if (isNaN(d.getTime())) return '';

    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }

  //Enviar formulario
  onSubmit() {
    const id = this.id();
    // Salir del formulario si es invalido o no hay id
    if (this.editBlogPostForm.invalid || !id) {
      this.editBlogPostForm.markAllAsTouched();
      return;
    }

    // Obtner todos los valores del formulario
    const formValueRaw = this.editBlogPostForm.getRawValue();

    // pasar valores del formulario al backend
    const updateBlogPostRequestDto: UpdateBlogPostRequest = {
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

    // pasar los valores al servicio para actualizar
    this.blogPostService.updateBlogPostById(id, updateBlogPostRequestDto);
  }

  //Eliminar BlogPost
  deleteBlogPost() {
    const id = this.id();
    if (!id) return;

    this.blogPostService.deleteBlogPostById(id).subscribe({
      next: () => {
        this.router.navigate(['/admin/blogposts']);
      },
      error: () => {
        console.log('Ocurrió un error en el servidor. Inténtalo nuevamente más tarde.');
      },
    });
  }
}
