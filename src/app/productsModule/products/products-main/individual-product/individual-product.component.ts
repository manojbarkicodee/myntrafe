import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { product } from 'src/app/productsModule/model';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { WishlistService } from 'src/app/services/wishlist/wishlist.service';

@Component({
  selector: 'app-indivisual-product',
  templateUrl: './individual-product.component.html',
  styleUrls: ['./individual-product.component.scss'],
})
export class IndivisualProductComponent {
  @Input() product!: product;
  indicators: boolean = false;
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  url!: string;
  constructor(
    private Authservice: AuthenticationService,
    private route: ActivatedRoute,
    private wishlistservice: WishlistService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  setCurrentRoute() {
    this.route.url.subscribe((url) => {
      this.url = url[0].path;
    });
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

  mousehover() {
    this.indicators = true;
  }
  mouseleave() {
    this.indicators = false;
  }

  addProductToWishlist(event: Event, id: number) {
    let check = this.Authservice.checkUserLogin();

    event.stopPropagation();

    if (!check) {
      let url = this.url;

      this.router.navigate(['/signup'], { queryParams: { reference: url } });
    } else {
      this.wishlistservice
        .postMethod_AddProductsToWishlist([{ productId: id }])
        .subscribe({
          next: (data: any) => {
            this.product.wishlisted = true;
            this.showAlert(data.message, 'success');
          },

          error: (error) => {
            let {
              error: { message },
            } = error;

            this.showAlert(
              'Something went wrong,Please try again later!',
              'error'
            );
          },
        });
    }
  }
}
