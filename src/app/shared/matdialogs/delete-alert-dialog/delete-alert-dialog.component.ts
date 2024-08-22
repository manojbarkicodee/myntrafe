import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { concatMap } from 'rxjs';
import { alertDynamicData, cartProducts } from 'src/app/cart-module/model';
import { CartService } from 'src/app/services/cart/cart.service';
import { WishlistService } from 'src/app/services/wishlist/wishlist.service';

@Component({
  selector: 'app-delete-alert-dialog',
  templateUrl: './delete-alert-dialog.component.html',
  styleUrls: ['./delete-alert-dialog.component.scss'],
})
export class DeleteAlertDialogComponent implements OnInit {
  constructor(
    private cartservice: CartService,
    private wishlistservice: WishlistService,
    @Optional() public dialogRef: MatDialogRef<DeleteAlertDialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: alertDynamicData,
    @Optional()
    private _bottomSheetRef: MatBottomSheetRef<DeleteAlertDialogComponent>,
    @Optional()
    @Inject(MAT_BOTTOM_SHEET_DATA)
    public mobileData: alertDynamicData
  ) {}
  ngOnInit(): void {
    if (!this.data) {
      this.data = this.mobileData;
    }
  }
  onNoClick(): void {
    if (this.data.mobileView) {
      this._bottomSheetRef.dismiss();
    } else {
      this.dialogRef.close();
    }
  }
  openLink(event: MouseEvent): void {
    this._bottomSheetRef.dismiss();
    event.preventDefault();
  }
  methodTo_deleteProduct(check: string) {
    if (this.data.mobileView) {
      this._bottomSheetRef.dismiss([]);
    } else {
      this.dialogRef.close([]);
    }
    if (check !== 'CANCEL') {
      this.cartservice
        .deleteMethod_toProductsInCart(this.data.deleteid)
        .pipe(
          concatMap((el) => {
            return this.cartservice.getMethod_GetCartProducts();
          })
        )
        .subscribe((data) => {
          this.cartservice.cartProducts.next(data[0].products);
        });
    }
  }

  methodTo_moveProductToWishlist() {
    this.wishlistservice
      .postMethod_AddProductsToWishlist(this.data.wishlidids)
      .subscribe({
        next: (data: any) => {},
        error: (error) => {
          let {
            error: { message },
          } = error;
        },
      });
    this.methodTo_deleteProduct('wishlist');
    if (this.data.mobileView) {
      this._bottomSheetRef.dismiss([]);
    } else {
      this.dialogRef.close([]);
    }
  }
}
