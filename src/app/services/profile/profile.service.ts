import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, map } from 'rxjs';
import { successResponse } from 'src/app/cart-module/model';
import { orderDetails, profileDetails } from 'src/app/profile-module/model';
let url = 'http://localhost:8000';
@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  constructor(private http: HttpClient) {}
  orderDetails: Subject<orderDetails[]> = new Subject();

  getOrderedDetails() {
    return this.http.get<orderDetails[]>(`${url}/order`);
  }

  deleteOrderedProduct(orderId: number, productId: number) {
    return this.http.patch(`${url}/order/${orderId}/${productId}`, {});
  }

  getProfileDetails() {
    return this.http.get<profileDetails>(`${url}/profile`).pipe(
      map((details) => {
        details.alternateMobileNumber = details.alternateMobileNumber
          ? details.alternateMobileNumber
          : '';
        if (details.birthDate) {
          let [year, month, date] = details.birthDate?.split('-');
          details.birthDate = date + '/' + month + '/' + year;
        }
        details.birthDate = details.birthDate ? details.birthDate : '';
        details.email = details.email ? details.email : '';
        details.fullName = details.fullName ? details.fullName : '';
        details.gender = details.gender ? details.gender : '';
        details.location = details.location ? details.location : '';
        details.mobileNumber = details.mobileNumber ? details.mobileNumber : '';
        return details;
      })
    );
  }

  editProfileDetails(body: profileDetails) {
    return this.http.put<successResponse>(`${url}/profile/edit`, body);
  }
}
