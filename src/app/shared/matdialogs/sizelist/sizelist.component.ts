import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CartService } from 'src/app/services/cart/cart.service';
import { wishlistproduct } from 'src/app/wishlist-module/model';
import { SharedModule } from 'src/app/shared/shared.module';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { concatMap } from 'rxjs';
import { WishlistService } from 'src/app/services/wishlist/wishlist.service';
import { ActivatedRoute } from '@angular/router';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { BottomSheetOverviewExampleSheet } from 'src/app/productsModule/products/product.component';

export interface DialogData {
  animal: string;
  name: string;
}
@Component({
  selector: 'app-sizelist',
  templateUrl: './sizelist.component.html',
  styleUrls: ['./sizelist.component.scss'],
})
export class SizelistComponent implements OnInit {
  size: string = '';
  showSizeAlert: boolean = false;
  sizeElement!: HTMLDivElement;
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  url!: string;
  constructor(
    @Optional() public dialogRef: MatDialogRef<SizelistComponent>,
    @Optional()  @Inject(MAT_DIALOG_DATA) public data: { wishlistproduct: wishlistproduct; checkRoute: boolean },
    private route: ActivatedRoute,
    private wishlistService: WishlistService,
    private cartService: CartService,
    private snackBar: MatSnackBar,
    @Optional()  private _bottomSheetRef: MatBottomSheetRef<SizelistComponent>,@Optional()  @Inject(MAT_BOTTOM_SHEET_DATA) public mobileData:  { wishlistproduct: wishlistproduct; checkRoute: boolean,mobileView:boolean }
  ) {}

  ngOnInit(): void {}

  onNoClick(): void {
    if(this.mobileData){
      this._bottomSheetRef.dismiss()
    }else{
      this.dialogRef.close();
    }
  }

  openSnackBar(message: string, action: string, panelClass: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
      verticalPosition: this.verticalPosition,
      horizontalPosition: this.horizontalPosition,
      panelClass: [panelClass],
    });
  }

  showAlert(message: string, panelClass: string) {
    this.openSnackBar(message, 'Close', panelClass);
  }

  selectSize(size: string, sizeElement: HTMLDivElement) {
    this.size = size;
    sizeElement.classList.add('onSelect');
    if (
      this.sizeElement &&
      this.sizeElement.innerText !== sizeElement.innerText
    ) {
      this.sizeElement.classList.remove('onSelect');
    }
    this.sizeElement = sizeElement;
  }

  addProductsToBag(id: number) {
    if (!this.size) {
      this.showAlert('Please select size', 'info');
      this.onNoClick();
    } else {
      this.showSizeAlert = false;

      this.wishlistService
        .deleteMethod_toProductsInWishlist(id)
        .pipe(
          concatMap((el) =>
            this.wishlistService.getMethod_ProductsInWishlist('/wishlist')
          ),
          concatMap((el) => {
            let wishlistproducts = el[0].products;
            this.wishlistService.wishlistProducts.next(wishlistproducts);
            return this.cartService.postMethod_AddProductsToCart({
              productId: id,
              size: this.size,
            });
          })
        )
        .subscribe({
          next: (data: any) => {
            if (data.message === 'product added to cart') {
              let productsCountInCart =
                this.cartService.productsCountInCart + 1;
              this.cartService.productsCount.next(productsCountInCart);
            }
            this.showAlert(data.message, 'success');
            this.onNoClick();
          },
          error: (error) => {},
        });
    }
  }

  addSize() {
    if (this.mobileData) {
      this._bottomSheetRef.dismiss(this.size);
    } else {
      this.dialogRef.close(this.size);
    }
  
  }
}
