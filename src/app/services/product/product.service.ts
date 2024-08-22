import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { productDetails, similarProducts } from 'src/app/productsModule/model';
let url = 'http://localhost:8000';
@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private http: HttpClient) {}

  getProductById(endpoint: string) {
    return this.http.get<productDetails>(`${url}${endpoint}`).pipe(
      map((product) => {
        let images = product.Images.filter((el) => {
          return el.imageUrl !== '';
        });
        product.Images = images;
        return product;
      })
    );
  }

  getSimilarProductsbyCategory(endpoint: string) {
    return this.http.get<similarProducts[]>(`${url}${endpoint}`);
  }
}
