import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { wishlistproduct } from 'src/app/wishlist-module/model';

let url = 'http://localhost:8000';
@Injectable({
  providedIn: 'root',
})
export class WishlistService {
  wishlistProducts: Subject<wishlistproduct[]> = new Subject();
  constructor(private http: HttpClient) {}

  getMethod_ProductsInWishlist(endpoint: string) {
    return this.http.get<{ products: wishlistproduct[] }[]>(
      `${url}${endpoint}`
    );
  }

  postMethod_AddProductsToWishlist(body: any) {
    return this.http.post(`${url}/wishlist`, body);
  }

  deleteMethod_toProductsInWishlist(id: number) {
    return this.http.delete(`${url}/wishlist/${id}`);
  }
}
