import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CategoryService } from '../services/category-service';
import { TruncatePipe } from '../../../core/pipes/truncate-pipe';

@Component({
  selector: 'app-category-list',
  imports: [RouterLink, TruncatePipe],
  templateUrl: './category-list.html',
})
export class CategoryList {
  private categoryService = inject(CategoryService);
  private getAllcategoryServiceRef = this.categoryService.getAllCategories();

  isLoading = this.getAllcategoryServiceRef.isLoading;
  isError = this.getAllcategoryServiceRef.error;
  valueCategories = this.getAllcategoryServiceRef.value;
}
