import {
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { product, queryParams } from '../../model';
import { httpService } from 'src/app/services/products/products.service';
import { WishlistService } from 'src/app/services/wishlist/wishlist.service';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
@Component({
  selector: 'app-products-main',
  templateUrl: './products-main.component.html',
  styleUrls: ['./products-main.component.scss'],
})
export class ProductsMainComponent implements OnInit, OnDestroy {
  @ViewChild('main') main!: ElementRef;

  products!: product[];
  noProducts: boolean = false;
  hover: string = '';
  showPrevButton: boolean = false;
  showNextButton: boolean = true;
  paginationData!: product[];
  productsSubscription!: Subscription;
  @Input() queryParams!: queryParams;
  @Input() enableFilter!: boolean;
  @Input() isMobileView!: boolean;
  category!: string;
  page: number = 1;
  showPages!: number[];
  totalPage!: number;
  checkLogin!: boolean;

  constructor(
    private route: ActivatedRoute,
    private wishListservice: WishlistService,
    private httpservice: httpService,
    private router: Router,
    private authentiation: AuthenticationService
  ) {}
  ngOnInit(): void {
    this.checkLogin = this.authentiation.checkUserLogin();

    this.renderProductsChangeInQueryParams();

    this.renderProductsChangeInParams();

    this.productsSubscription = this.httpservice.products.subscribe({
      next: (data1: product[]) => {
        this.products = data1;
        if (this.checkLogin) {
          this.activeWishlistedProduct();
        }

        this.paginationData = this.paginationMethod(this.page);

        this.totalPage = Math.ceil(data1.length / 20);

        this.showPages = new Array(this.totalPage)
          .fill(1)
          .map((el, i) => i + 1);

        if (this.page === this.totalPage) {
          this.showNextButton = false;
        } else {
          this.showNextButton = true;
        }

        if (this.paginationData.length === 0) {
          this.noProducts = true;
        } else {
          this.noProducts = false;
        }
        // this.setNoproducts();

        this.httpservice.scrollToTop();
      },
      error: () => {},
      complete: () => {
        this.productsSubscription.unsubscribe();
      },
    });
  }

  renderProductsChangeInParams() {
    this.route.params.subscribe((el: Params) => {
      let category = el['category'];

      this.category = category;

      let endpoint = `/products/${category}`;

      let queryParams = this.route.snapshot.queryParams;
      if(queryParams['search']){
        endpoint='/products'
      }
      let newQueryParams = { ...queryParams };

      for (let key in newQueryParams) {
        if (key !== 'sort') {
          newQueryParams[key] = newQueryParams[key].split(',');
        }
      }

      this.queryParams = newQueryParams;

      this.httpservice.queryParams.next(this.queryParams);
      this.httpservice.getProductsbyCategory(endpoint, queryParams).subscribe({
        next: (data: product[]) => {
          this.httpservice.products.next(data);
        },
        error: (error) => {},
      });
    });
  }

  renderProductsChangeInQueryParams() {
    this.route.queryParams.subscribe({
      next: (data) => {
        let endpoint = `/products/${this.category}`;
        let { search } = data;
        if (search) {
          endpoint = `/products`;
        }
        if(this.category||search){
          this.httpservice
          .getProductsbyCategory(endpoint, data)
          .subscribe((data) => {
            this.httpservice.products.next(data);
          });
        }
    
      },
    });
  }

  redirectToPageMethod(page: number) {
    this.page = page;
    if (this.page === 1) {
      this.showPrevButton = false;
    }
    if (this.page > 1) {
      this.showPrevButton = true;
    }
    if (this.page === this.totalPage) {
      this.showNextButton = false;
    }
    if (this.page < this.totalPage) {
      this.showNextButton = true;
    }
    this.paginationData = this.paginationMethod(page);
  }

  redirectToPreviousPage() {
    this.page = this.page - 1;
    if (this.page < this.totalPage) {
      this.showNextButton = true;
    }
    if (this.page <= 1) {
      this.showPrevButton = false;
    }
    this.paginationData = this.paginationMethod(this.page);
  }

  redirectToNextPage() {
    this.page = this.page + 1;

    if (this.page > 1) {
      this.showPrevButton = true;
    }
    if (this.page >= this.totalPage) {
      this.showNextButton = false;
    }
    this.paginationData = this.paginationMethod(this.page);
  }

  activeWishlistedProduct() {
    this.wishListservice
      .getMethod_ProductsInWishlist('/wishlist')
      .subscribe((wishlistProducts) => {
        wishlistProducts[0].products.forEach((wishlistProduct) => {
          this.products.forEach((product) => {
            if (wishlistProduct.id === product.id) {
              product.wishlisted = true;
            }
          });
        });
      });
  }
  paginationMethod(page: number): product[] {
    let startIndex = (page - 1) * 20;
    let endIndex = page * 20;
    let paginationData = this.products.slice(startIndex, endIndex);
    this.httpservice.scrollToTop();

    return paginationData;
  }

  navigateToNextRoute(id: number, category: string) {
    this.router.navigate(['/products', category, id]);
  }

  setNoproducts() {
    if (this.paginationData.length === 0) {
      this.noProducts = true;
    } else {
      this.noProducts = false;
    }
  }
  ngOnDestroy(): void {
   this.productsSubscription && this.productsSubscription.unsubscribe();
  }
}
