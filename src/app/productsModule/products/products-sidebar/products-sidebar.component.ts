import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { discountfilterList, pricefilterList } from './static.data';
import { MatCheckbox } from '@angular/material/checkbox';
import { httpService } from 'src/app/services/products/products.service';
import { PriceList, brandsSchema, colorsSchema } from '../../model';

@Component({
  selector: 'app-products-sidebar',
  templateUrl: './products-sidebar.component.html',
  styleUrls: ['./products-sidebar.component.scss'],
})
export class ProductsSidebarComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  @ViewChildren('checkbox') checkBox!: QueryList<MatCheckbox>;
  @ViewChild('productsidebar') productsidebar!: ElementRef<any>;
  @Input() queryParams!: any;
  @Input() enableFilter!: boolean;
  @Input() isMobileView!: boolean;
  checked: boolean = false;
  brands: brandsSchema[] = [];
  category!: string;
  colors!: colorsSchema[];
  pricelist!: PriceList[];
  discountlist!: PriceList[];
  filterItems: any = this.brands;
  filterList: any = [];
  active: string = 'brand';
  @Input() filterApply: boolean = false;
  constructor(
    private productsService: httpService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  toFixed: boolean = false;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const scrollPosition =
      window.pageYOffset ||
      document.documentElement.scrollTop ||
      document.body.scrollTop ||
      0;
    if (scrollPosition >= 720) {
      this.toFixed = true;
    } else {
      this.toFixed = false;
    }
  }

  ngOnInit(): void {
    this.pricelist = pricefilterList;
    this.discountlist = discountfilterList;
    this.checkFiltersOnDeleteChips();
    this.renderBrandsAndColorsChangeInParams();
    this.renderBrandsAndColorsOnSearch();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.checkBox.toArray().forEach((el) => {
        for (let key in this.queryParams) {
          if (el.name === key && this.queryParams[key].includes(el.value)) {
            el.checked = true;
          }
        }
      });
      if (this.isMobileView) {
        for (let key in this.queryParams) {
          if (key === 'brand') {
            this.setDefaultFilters('brand', this.brands, 'name');
          } else if (key === 'color') {
            this.setDefaultFilters('color', this.colors, 'primaryColour');
          } else if (key === 'price') {
            this.setDefaultFilters('price', this.pricelist, 'value');
          } else if (key === 'discount') {
            this.setDefaultFilters('discount', this.discountlist, 'value');
          }
        }
      }
    }, 200);
  }

  checkFiltersOnDeleteChips() {
    this.productsService.deleteFilterChip.subscribe((data) => {
      this.checkBox.toArray().forEach((el) => {
        if (el.value === data) {
          el.checked = false;
        }
      });
    });
  }

  renderBrandsAndColorsOnSearch() {
    this.route.queryParams.subscribe({
      next: (data) => {
        let { search, color } = data;
        if (search) {
          const colorsendpoint = `/products/colors`;
          this.productsService
            .getColorsMethod(colorsendpoint, search)
            .subscribe((colors) => {
              this.colors = colors.map((primarycolor: colorsSchema) => {
                let queryColor=[];
                if (color && color.length > 0) {
                  if (color.includes(',')) {
                    queryColor = color.split(',');
                  } else {
                    queryColor = [color];
                  }
                }
                primarycolor['checked'] =
                  queryColor && queryColor.includes(primarycolor.primaryColour);
                return primarycolor;
              });
              console.log(this.colors)
              this.brands = [];
              if (this.brands.length == 0) {
                this.active = 'price';
                this.filterItems = this.pricelist;
              }
            });
        }
      },
    });
  }

  renderBrandsAndColorsChangeInParams() {
    this.route.params.subscribe((el: Params) => {
      this.category = el['category'];
      if(this.category){
        const brandsendpoint = `/products/brands/${this.category}`;
        const colorsendpoint = `/products/colors/${this.category}`;
        this.productsService.getBrandsMethod(brandsendpoint).subscribe((data) => {
          this.brands = data;
          this.filterItems = this.brands;
        });
        this.productsService
          .getColorsMethod(colorsendpoint, '')
          .subscribe((data) => {
            this.colors = data.map((col) => {
              col['checked'] = false;
              return col;
            });
          });
      }
 
    });
  }
  onCheckedMethod(event: any, color?: any, view?: any) {
    let name;
    let value: string;
    let checked: boolean;
    if (!view) {
      name = event.source.name;
      value = event.source.value;
      checked = event.source.checked;
    } else {
      name = event.name;
      value = event.value;
      checked = event.checked;
    }

    this.customizeQueryparams(value, name, checked);
    this.productsService.queryParams.next(this.queryParams);
    let newqueryParams = { ...this.queryParams };

    for (let key in newqueryParams) {
      if (key !== 'sort') {
        newqueryParams[key] = newqueryParams[key].join(',');
      }
    }

    this.productsService.addQueryParametersToRoute(newqueryParams);
  }

  customizeQueryparams(value: string, name: string, checked: boolean) {
    if (this.queryParams[name] === undefined) {
      this.queryParams[name] = [];
    }
    if (checked) {
      if (!this.queryParams[name].includes(value)) {
        this.queryParams[name].push(value);
      }
    } else {
      let index = this.queryParams[name].findIndex(
        (item: any) => item === value
      );

      this.queryParams[name].splice(index, 1);

      if (this.queryParams[name].length === 0) {
        delete this.queryParams[name];
      }
    }
  }

  Validcolors(color: string) {
    switch (color) {
      case 'Navy Blue':
        return 'rgb(60,68,119)';
      case 'Mustard':
        return 'rgb(204,156,51)';
      case 'Burgundy':
        return 'rgb(160,50,69)';
      case 'Camel Brown':
        return 'rgb(180,154,89)';
      case 'Peach':
        return 'rgb(255,229,180)';
      case 'Off White':
        return 'rgb(242,242,242)';
      case 'Turquoise Blue':
        return 'rgb(64,224,208)';
      case 'Coffee Brown':
        return 'rgb(75,48,47)';
      case 'Multi':
        return 'white';
      default:
        return null;
    }
  }

  showFilterOptions(filter: string) {
    switch (filter) {
      case 'brand':
        this.filterItems = this.brands;
        this.active = 'brand';
        break;
      case 'price':
        this.filterItems = this.pricelist;
        this.active = 'price';
        break;
      case 'color':
        this.filterItems = this.colors;
        this.active = 'color';
        break;
      case 'discount':
        this.active = 'discount';
        this.filterItems = this.discountlist;
        break;
    }
  }

  toggleCheck(name: string, value: string, checked: boolean, index: number) {
    checked = !checked;
    this.filterItems[index].checked = checked;
    if (checked) {
      this.filterList.push({ name, value, checked });
    } else {
      let index = this.filterList.findIndex((item: any) => {
        return item.value === value;
      });
      this.filterList[index].checked = false;
    }
  }

  onApplyFilters() {
    for (let item of this.filterList) {
      this.onCheckedMethod(
        { name: item.name, value: item.value, checked: item.checked },
        '',
        'view'
      );
    }
  }

  setDefaultFilters(key: string, list: any, valueKey: string) {
    for (let filter of list) {
      for (let param of this.queryParams[key] ? this.queryParams[key]:[]) {
        if (filter[valueKey] === param) {
          filter.checked = true;
          this.filterList.push({
            name: key,
            value: filter[valueKey],
            checked: filter.checked,
          });
        }
      }
    }
  }

  ngOnDestroy(): void {
    if (this.filterApply) {
      this.onApplyFilters();
    }
  }
}
