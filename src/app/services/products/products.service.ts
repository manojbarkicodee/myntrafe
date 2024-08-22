import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, map } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import {
  brandsSchema,
  colorsSchema,
  product,
} from 'src/app/productsModule/model';
let url = 'http://localhost:8000';
@Injectable({
  providedIn: 'root',
})
export class httpService {
  products: Subject<product[]> = new Subject();

  queryParams: Subject<any> = new Subject();

  deleteFilterChip: Subject<string> = new Subject();

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  getBrandsMethod(endpoint: string) {
    return this.http.get<brandsSchema[]>(`${url}${endpoint}`);
  }

  getBrandsOnSearch(params: { search: string }) {
    return this.http.get<brandsSchema[]>(`${url}/brands`, { params: params });
  }

  getColorsMethod(endpoint: string, queryParams: string) {
    let params = {};
    if (queryParams) {
      params = { search: queryParams };
    }
    return this.http.get<colorsSchema[]>(`${url}${endpoint}`, {
      params: params,
    });
  }

  getProductsbyCategory(endpoint: string, queryParams: any) {
    return this.http
      .get<product[]>(`${url}${endpoint}`, { params: queryParams })
      .pipe(
        map((item) => {
          let newProducts = item.map((product) => {
            let images = product.Images.filter((el) => {
              return el.imageUrl !== '';
            });
            product.Images = images;
            return product;
          });
          return newProducts;
        })
      );
  }

  addQueryParametersToRoute(newqueryParams: any,previousUrl?:string) {
    if (newqueryParams['search']) {
      this.router.navigate(['products'], { queryParams: newqueryParams });
    } else {
      if(previousUrl){
        this.router.navigate([previousUrl])
      }else{
        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: newqueryParams,
        });
      }
     
    }
  }

  scrollToTop() {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  }
}
