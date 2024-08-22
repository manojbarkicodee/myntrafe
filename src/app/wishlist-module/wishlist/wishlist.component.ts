import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { WishlistService } from 'src/app/services/wishlist/wishlist.service';
import { wishlistproduct } from '../model';
import { Subscription, concatMap } from 'rxjs';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { SizelistComponent } from 'src/app/shared/matdialogs/sizelist/sizelist.component';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { BottomSheetOverviewExampleSheet } from 'src/app/productsModule/products/product.component';
import { httpService } from 'src/app/services/products/products.service';
@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.scss'],
})
export class WishlistComponent implements OnInit, OnDestroy {
  url!: string;
  checkLogin!: boolean;
  isMobileView:boolean=false;
  dynamicCompData!: {
    header: string;
    paragraph: string;
    buttonText: string;
  };
  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    this.checkScreenWidth();
  }
  wishlistProductsSubscription!: Subscription;
  productCount: number = 0;
  products: wishlistproduct[] = [];
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  constructor(
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private wishlistservice: WishlistService,
    private authetication: AuthenticationService,
    private router: Router,
    private _bottomSheet: MatBottomSheet,
    private scrollService: httpService,
  ) {}
  ngOnInit(): void {
    this.checkScreenWidth()
    this.scrollService.scrollToTop();
    this.checkLogin = this.authetication.checkUserLogin();
    this.setCurrentRoute();
    this.dynamicCompData = {
      header: 'PLEASE LOG IN',
      paragraph: 'Login to view items in your wishlist.',
      buttonText: 'LOGIN',
    };

    if (this.checkLogin) {
      this.wishlistservice
        .getMethod_ProductsInWishlist('/wishlist')
        .subscribe((data) => {
          this.wishlistservice.wishlistProducts.next(data[0].products);
        });
      this.wishlistProductsSubscription =
        this.wishlistservice.wishlistProducts.subscribe((data) => {
          this.products = data;
          this.productCount = this.products.length;
          this.checkWishlistEmpty();
        });
    }
  }
  checkScreenWidth(): void {
    this.isMobileView = window.innerWidth <= 500; // Adjust the threshold as needed
  }
  setCurrentRoute() {
    this.route.url.subscribe((url) => {
      this.url = url[0].path;
    });
  }

  openDialog(event: Event, id: number): void {
    event.stopPropagation();
    let newProduct = this.products.find((el) => {
      return el.id === id;
    });
    if (!this.isMobileView) {
      const dialogRef = this.dialog.open(SizelistComponent, {
        data: { wishlistproduct: newProduct, checkRoute: true },
      });
      dialogRef.afterClosed();
    } else {
      const dialogRef = this._bottomSheet.open(SizelistComponent, {
        data: {
          wishlistproduct: newProduct,
          checkRoute: true,
          mobileView: true,
        },
      });
      dialogRef.afterDismissed();
    }

  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
      verticalPosition: this.verticalPosition,
      horizontalPosition: this.horizontalPosition,
    });
  }

  showAlert(message: string) {
    this.openSnackBar(message, 'Close');
  }

  deleteProductMethod(id: number, event: Event) {
    event.stopPropagation();
    this.wishlistservice
      .deleteMethod_toProductsInWishlist(id)
      .pipe(
        concatMap((el) => {
          this.showAlert('item removed from wishlist');
          return this.wishlistservice.getMethod_ProductsInWishlist('/wishlist');
        })
      )
      .subscribe((data) => {
        this.products = data[0].products;
        this.productCount = this.products.length;
        this.checkWishlistEmpty();
      });
  }

  navigateToProductDetails(id: Number, category: string) {
    this.router.navigate(['/products', category, id]);
  }

  checkWishlistEmpty() {
    if (this.products.length === 0) {
      this.checkLogin = false;
      this.dynamicCompData = {
        header: 'YOUR WISHLIST IS EMPTY',
        paragraph:
          'Add items that you like to your wishlist. Review them anytime and easily move them to the bag.',
        buttonText: 'CONTINUE SHOPPING',
      };
    } else {
      this.checkLogin = true;
    }
  }

  ngOnDestroy(): void {
    if (this.checkLogin && this.wishlistProductsSubscription) {
      this.wishlistProductsSubscription.unsubscribe();
    }
  }
}
