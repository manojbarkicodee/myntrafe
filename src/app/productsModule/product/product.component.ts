import { AfterViewInit, Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ProductService } from 'src/app/services/product/product.service';
import { productDetails, similarProducts, termsAndConditions } from '../model';
import {
  ProductdeliveryInformation,
  bestOffers,
  otherDetails,
} from './staticData';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { WishlistService } from 'src/app/services/wishlist/wishlist.service';
import { CartService } from 'src/app/services/cart/cart.service';
import { NgbCarousel } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-details-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
})
export class ProductDetailsComponent implements OnInit, AfterViewInit {
  category!: string;
  product!: productDetails;
  deliveryInfo!: string[];
  offersInfo!: string[];
  otherDetails!: termsAndConditions[];
  similarProducts!: similarProducts[];
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  size: string = '';
  goToBag: boolean = false;
  sizeElement!: HTMLDivElement;
  showSizeAlert: boolean = false;
  currentUrl!: string;
  indicators: boolean = false;
  isMobileView!: boolean;
  @ViewChild('carousel') ngCarousel!: NgbCarousel;
  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    this.checkScreenWidth();
  }
  constructor(
    private snackBar: MatSnackBar,
    private cartService: CartService,
    private httpservice: ProductService,
    private wishlist: WishlistService,
    private route: ActivatedRoute,
    private Authservice: AuthenticationService,
    private router: Router
  ) {}
  ngAfterViewInit(): void {
    setTimeout(() => {
      if (this.ngCarousel) {
        console.log(this.ngCarousel);
        this.ngCarousel.pause();
      }
    }, 100);
  }
  ngOnInit(): void {
    this.checkScreenWidth();
    this.deliveryInfo = ProductdeliveryInformation;
    this.offersInfo = bestOffers;
    this.otherDetails = otherDetails;

    this.route.params.subscribe((params: Params) => {
      let { category, id } = params;
      this.category = category;

      let endpoint = `/products/${category}/${id}`;

      let similarProductsEndPoint = `/products/${category}/similar`;

      this.httpservice.getProductById(endpoint).subscribe({
        next: (data: productDetails) => {
          this.product = data;
          if (this.Authservice.checkUserLogin()) {
            this.activeWishlistedProduct();
          }
        },
        error: (error) => {},
      });

      this.httpservice
        .getSimilarProductsbyCategory(similarProductsEndPoint)
        .subscribe((data: similarProducts[]) => {
          this.similarProducts = data;
        });
    });
  }

  checkScreenWidth(): void {
    this.isMobileView = window.innerWidth <= 900; // Adjust the threshold as needed
  }

  setCurrentUrl() {
    this.route.url.subscribe((data) => {
      this.currentUrl = data[0].path;
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
    this.ngCarousel.cycle();
  }
  mouseleave() {
    this.ngCarousel.pause();
  }
  selectSize(size: string, sizeElement: HTMLDivElement) {
    this.size = size;
    this.showSizeAlert = false;
    sizeElement.classList.add('onSelect');
    if (
      this.sizeElement &&
      this.sizeElement.innerText !== sizeElement.innerText
    ) {
      this.sizeElement.classList.remove('onSelect');
    }
    this.sizeElement = sizeElement;
  }

  addProductsToBag(id: number | undefined) {
    let check = this.Authservice.checkUserLogin();
    if (!check) {
      this.router.navigate(['/signup'], {
        queryParams: { reference: this.currentUrl },
      });
    } else {
      if (!this.size) {
        this.showSizeAlert = true;
      } else {
        this.showSizeAlert = false;

        if (!this.goToBag) {
          this.cartService
            .postMethod_AddProductsToCart({ productId: id, size: this.size })
            .subscribe({
              next: (data: any) => {
                console.log(data)
                if (data.message === 'product added to cart') {
                  let productsCountInCart =
                    this.cartService.productsCountInCart + 1;
                  this.cartService.productsCount.next(productsCountInCart);
                }

                this.goToBag = true;
                this.showAlert(data.message, 'success');
              },
              error: (error) => {},
            });
        } else {
          this.router.navigate(['/cart']);
        }
      }
    }
  }
  activeWishlistedProduct() {
    this.wishlist
      .getMethod_ProductsInWishlist('/wishlist')
      .subscribe((wishlistProducts) => {
        wishlistProducts[0].products.forEach((wishlistProduct) => {
          // this.products.forEach((product) => {
          if (this.product) {
            if (wishlistProduct.id === this.product.id) {
              this.product.wishlisted = true;
            }
          }

          // });
        });
      });
  }
  addProductToWishlist(id: Number | undefined) {
    let check = this.Authservice.checkUserLogin();
    if (!check) {
      let url = this.currentUrl;
      this.router.navigate(['/signup'], { queryParams: { reference: url } });
    } else {
      if (this.product?.wishlisted) {
        return;
      }
      this.wishlist
        .postMethod_AddProductsToWishlist([{ productId: id }])
        .subscribe({
          next: (data: any) => {
            if (this.product) {
              this.product.wishlisted = true;
            }
            this.showAlert(data.message, 'success');
          },
          error: (error) => {},
        });
    }
  }
}
