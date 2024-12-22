import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { StoreService } from 'src/app/services/store.service';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html'
})
export class FiltersComponent implements OnInit, OnDestroy {
  @Output() showCategory = new EventEmitter<string>();
  categoriesSubscription: Subscription | undefined;
  categories: Array<{ id: number, name: string, description: string }> | undefined;

  constructor(private storeService: StoreService) {}

  ngOnInit(): void {
    this.categoriesSubscription = this.storeService.getAllCategories().subscribe((categories) => {
      this.categories = categories;
    });
  }

  onShowCategory(categoryId: number): void {
    this.showCategory.emit(categoryId.toString());
  }

  ngOnDestroy(): void {
    if (this.categoriesSubscription) {
      this.categoriesSubscription.unsubscribe();
    }
  }
}

