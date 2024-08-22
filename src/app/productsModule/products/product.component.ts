import { Component, HostListener, Inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { queryParams } from '../model';
import { MatBottomSheet, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MatListModule } from '@angular/material/list';
import {MAT_BOTTOM_SHEET_DATA} from '@angular/material/bottom-sheet';
import { httpService } from 'src/app/services/products/products.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
})
export class ProductComponent implements OnInit {
  queryParams: queryParams = {};
  enableFilter: boolean = false;
  constructor(
    private route: ActivatedRoute,
    private _bottomSheet: MatBottomSheet
  ) {}

  isMobileView: boolean = false;
  filterApply: boolean = false;
  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    this.checkScreenWidth();
  }

  openBottomSheet(): void {
    this._bottomSheet.open(BottomSheetOverviewExampleSheet, {
      data: {
        queryParams: this.queryParams,
      },
    });
  }

  checkScreenWidth(): void {
    this.isMobileView = window.innerWidth <= 500; // Adjust the threshold as needed
  }
  ngOnInit(): void {
    this.route.params.subscribe((data) => {
      let queryParams = this.route.snapshot.queryParams;
      let newQueryParams = { ...queryParams };
      for (let key in newQueryParams) {
        if (key !== 'sort') {
          newQueryParams[key] = newQueryParams[key].split(',');
        }
      }

      this.queryParams = newQueryParams;
    });

    this.route.queryParams.subscribe((data) => {
      let { search } = data;
      if (search) {
        let newQueryParams = { ...data };
        for (let key in newQueryParams) {
          if (key !== 'sort') {
            newQueryParams[key] = newQueryParams[key].split(',');
          }
        }

        this.queryParams = newQueryParams;
      }
    });
    this.checkScreenWidth();
  }

  ClickOnFilter() {
    this.enableFilter = !this.enableFilter;
  }

  sort() {
    this.openBottomSheet();
  }

  applyFilter() {
    this.filterApply = true;
    setTimeout(() => {
      this.enableFilter = false;
    }, 500);
  }
}


@Component({
  selector: 'bottom-sheet-overview-example-sheet',
  template: `      <div  class="sortOptions">
    <p class="header">SORT BY</p>
  <p class='options' [ngClass]="selectOption===sortValue?'active':''"
    *ngFor="let sortValue of sortingValues"
    (click)="selectOptionsMethod(sortValue)"
  >
    {{ sortValue }}
  </p>
</div>`,
styles:[
  `  .sortOptions {
    text-align: left;
    display: flex;
    flex-direction: column;
    gap: 25px;
    padding-top: 25px;
    padding-bottom: 25px;
    background-color: white;
    border-top: 0px;
    .header{
      border-bottom: 0.5px solid #00000030;
    font-weight: 500;
    padding-bottom: 5px;
    font-size: 13px;
    }
    .options{
      padding-left: 30px;
    font-size: 13px;
    cursor: pointer;
    }
  }
  .active{
    color:#FF517B;
    border-left:2px solid #FF517B;
  }
  :host ::ng-deep .mat-bottom-sheet-container {
    padding:0px!important;
  }
  `
],
  standalone: true,
  imports: [MatListModule,CommonModule],
})
export class BottomSheetOverviewExampleSheet implements OnInit {
  sortingValues!: string[];
  queryParams!:any;
  selectOption: string = 'Recommended';
  constructor( private httpservice: httpService,private _bottomSheetRef: MatBottomSheetRef<BottomSheetOverviewExampleSheet>,@Inject(MAT_BOTTOM_SHEET_DATA) public data: any) {}

  openLink(event: MouseEvent): void {
    this._bottomSheetRef.dismiss();
    event.preventDefault();
  }
  ngOnInit(): void {
    this.queryParams=this.data.queryParams
  this.sortingValues = [
    'Recommended',
    'Better Discount',
    'Price:Low to High',
    'Price:High to Low',
    'Customer Rating',
  ];
  this.setSortingValuesOnReaload()
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
  this._bottomSheetRef.dismiss();
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
}