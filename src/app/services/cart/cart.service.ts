import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import {
  address,
  addressData,
  card,
  cardresponse,
  cartProducts,
  orderPayload,
  outputCardData,
  pricingDetails,
  selectedProducts,
  successResponse,
} from 'src/app/cart-module/model';

let url = 'http://localhost:8000';
@Injectable({
  providedIn: 'root',
})
export class CartService {
  cartProducts: Subject<cartProducts[]> = new Subject();

  productsCountInCart!: number;

  pricingDetails: Subject<pricingDetails> = new Subject();

  addressess: Subject<address[]> = new Subject();

  selectedAddress!: address;

  selectedProducts!: selectedProducts[];

  cards: Subject<cardresponse[]> = new Subject();

  productsCount: Subject<number> = new Subject();

 
  constructor(private http: HttpClient) {}

  postMethod_AddProductsToCart(body: {
    productId: Number | undefined;
    size: string;
  }) {
    return this.http.post(`${url}/cart`, body);
  }

  getMethod_GetCartProducts()  {
    return this.http.get<{ products: cartProducts[] }[]>(`${url}/cart`);
  }

  deleteMethod_toProductsInCart(id: number | string) {
    return this.http.delete(`${url}/cart/${id}`);
  }

  postMethod_toAddAddress(body: addressData) {
    return this.http.post(`${url}/address`, body);
  }

  getMethod_toGetAddresses() {
    return this.http.get<address[]>(`${url}/address`);
  }

  deleteMethod_toDeleteAddress(id: number) {
    return this.http.delete<address[]>(`${url}/address/${id}`);
  }

  updateMethodtoAddress(id: number, body: address) {
    return this.http.put(`${url}/address/${id}`, body);
  }

  getProductsCount() {
    return this.http.get<{ productsCount: number }>(`${url}/cart/count`);
  }

  postMethodToCardS(body: card) {
    let payload: outputCardData = {
      cardnumber: body.cardnumber,
      name: body.name,
      expirydate: body.date,
      cvvnumber: body.cvv,
    };
    return this.http.post<successResponse>(`${url}/cards`, payload);
  }

  getMethodToCards() {
    return this.http.get<cardresponse[]>(`${url}/cards`);
  }

  deleteMethodToCards(id:number){
    return this.http.delete(`${url}/cards/${id}`)
  }
  postMethodToPlaceOrder(payload: orderPayload) {
    return this.http.post<successResponse>(`${url}/order`, payload);
  }
}
