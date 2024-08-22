import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs';
import { filteringChips, queryParams } from '../../model';
import { httpService } from 'src/app/services/products/products.service';

@Component({
  selector: 'app-products-header',
  templateUrl: './products-header.component.html',
  styleUrls: ['./products-header.component.scss'],
})
export class ProductsHeaderComponent implements OnInit, OnDestroy {
  productsSubscription!: Subscription;
  @Input() queryParams!: queryParams;
  @Input() mobileView!: boolean;
  productsCount!: number;
  category!: string;
  sortingValues!: string[];
  showSelectOptions: boolean = false;
  selectOption: string = 'Recommended';
  filteringChips: filteringChips[] = [];
  queryParamsSubscription!: Subscription;

  constructor(
    private httpservice: httpService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.sortingValues = [
      'Recommended',
      'Better Discount',
      'Price:Low to High',
      'Price:High to Low',
      'Customer Rating',
    ];
    this.setSortingValuesOnReaload();
    if(!this.mobileView){
      this.addFilterChipsOnEachFilterChange();
    }

    this.setProductsCountOnFilter();

    this.setCurrentProductPageOnParamsChange();
  }

  setSortingValuesOnReaload() {
    let { sort } = this.queryParams;
    if (sort) {
      let [name, value] = (sort as string).split(':');

      switch (name) {
        case 'price':
          if (value === 'asc') {
            this.selectOption = 'Price:Low to High';
          } else {
            this.selectOption = 'Price:High to Low';
          }
          break;

        case 'discountInpercentage':
          this.selectOption = 'Better Discount';
          break;
        case 'ratings':
          this.selectOption = 'Customer Rating';
          break;
      }
    }
  }

  addFilterChipsOnEachFilterChange() {
    this.queryParamsSubscription = this.httpservice.queryParams.subscribe(
      (data: any) => {
        let chipsObject = { ...data };

        chipsObject = this.formatingFilterChips(chipsObject);
        this.filteringChips = [];
        for (let chips in chipsObject) {
          this.filteringChips = [...this.filteringChips, ...chipsObject[chips]];
        }
      }
    );
  }

  formatingFilterChips(chipsObject: any) {
    if (chipsObject.sort) {
      delete chipsObject.sort;
    }
    if (chipsObject.search) {
      delete chipsObject.search;
    }

    for (let key in chipsObject) {
      chipsObject[key] = chipsObject[key].map((el: string) => {
        return { value: el, displayValue: el, name: key };
      });

      if (key !== 'sort') {
        if (key === 'price') {
          chipsObject[key] = chipsObject[key].map((el: filteringChips) => {
            let [min, max] = el.displayValue.split(':');
            return {
              value: el.value,
              displayValue: 'Rs.' + min + ' to ' + 'Rs.' + max,
              name: el.name,
            };
          });
        }

        if (key === 'discount') {
          chipsObject[key] = chipsObject[key].map((el: filteringChips) => {
            let [min, max] = el.displayValue.split(':');
            return {
              value: el.value,
              displayValue: min + '%' + ' to ' + max + '%',
              name: el.name,
            };
          });
        }
      }
    }
    return chipsObject;
  }

  setProductsCountOnFilter() {
    this.productsSubscription = this.httpservice.products.subscribe((data) => {
      this.productsCount = data.length;
    });
  }

  setCurrentProductPageOnParamsChange() {
    this.route.params.subscribe((el: Params) => {
      let category = el['category'];
      this.category = category;
    });
  }
  mousehover(): void {
    this.showSelectOptions = true;
  }

  mouseleave(): void {
    this.showSelectOptions = false;
  }

  removeChip(value: filteringChips): void {
    let index = this.filteringChips.findIndex(
      (el) => el.displayValue === value.displayValue
    );

    for (let key in this.queryParams) {
      if (key === value.name) {
        let queryIndex: number = (
          this.queryParams[key as keyof typeof this.queryParams]! as string[]
        ).findIndex((el: string) => {
          return el === value.value;
        });

        (
          this.queryParams[key as keyof typeof this.queryParams]! as string[]
        ).splice(queryIndex, 1);
        if ( (this.queryParams[key as keyof typeof this.queryParams]! as string[]).length === 0) {
          delete this.queryParams[key as keyof typeof this.queryParams];
        }
      }
    }
    let newqueryParams: queryParams = { ...this.queryParams };

    for (let key in newqueryParams) {
      if (key !== 'sort') {
        newqueryParams[key as keyof typeof this.queryParams] = (
          newqueryParams[key as keyof typeof this.queryParams]! as string[]
        ).join(',');
      }
    }

    this.httpservice.addQueryParametersToRoute(newqueryParams);

    this.filteringChips.splice(index, 1);
    this.httpservice.deleteFilterChip.next(value.value);
  }

  selectOptionsMethod(value: string): void {
    this.selectOption = value;
    let sortValue = value;
    if (this.queryParams.sort === 'undefined') {
      this.queryParams.sort = '';
    }
    switch (sortValue) {
      case 'Recommended':
        delete this.queryParams.sort;
        break;
      case 'Price:Low to High':
        this.queryParams.sort = 'price:asc';
        break;
      case 'Price:High to Low':
        this.queryParams.sort = 'price:desc';
        break;
      case 'Better Discount':
        this.queryParams.sort = 'discountInpercentage:desc';
        break;
      case 'Customer Rating':
        this.queryParams.sort = 'ratings:desc';
        break;
    }
    let newqueryParams = { ...this.queryParams };

    for (let key in newqueryParams) {
      if (key !== 'sort') {
        newqueryParams[key as keyof typeof this.queryParams] = (
          newqueryParams[key as keyof typeof this.queryParams]! as string[]
        ).join(',');
      }
    }

    this.httpservice.addQueryParametersToRoute(newqueryParams);
  }

  ngOnDestroy(): void {
    this.productsSubscription && this.productsSubscription.unsubscribe();
    this.queryParamsSubscription && this.queryParamsSubscription.unsubscribe();
  }
}
