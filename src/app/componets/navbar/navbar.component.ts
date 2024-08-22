import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Subscription, debounceTime, filter, fromEvent, tap } from 'rxjs';
import { brandsSchema } from 'src/app/productsModule/model';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { CartService } from 'src/app/services/cart/cart.service';
import { httpService } from 'src/app/services/products/products.service';
import { ProfileService } from 'src/app/services/profile/profile.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit, AfterViewInit,OnDestroy {
  hover: boolean = false;
  showProfile: boolean = true;
  cartProductsCount!: number;
  getSearchData: boolean = false;
  searchValue: string = '';
  checkLogin!: boolean;
  currentUrl!: string;
  previousUrl!: string;
  brandsOnSearch: brandsSchema[] = [];
  userName!: string;
  drawerOpened:boolean=false;
  noBrands:boolean=false;
  @Output()openedChange!: EventEmitter<boolean>;
  @ViewChild('input', { static: true }) input!: ElementRef;
  cartCount!:Subscription
  constructor(
    private productService: httpService,
    private cartservice: CartService,
    private router: Router,
    private authentication: AuthenticationService,
    private profileService: ProfileService
  ) {}

  ngOnInit(): void {
    this.checkLogin = this.authentication.checkUserLogin();
    this.methodToGetRoutes();

    if (this.checkLogin) {
      this.cartservice.getMethod_GetCartProducts().subscribe((data) => {
        this.cartservice.productsCount.next(data[0].products.length);
      });
    }
    this.cartservice.productsCount.subscribe((count) => {
      this.cartProductsCount = count;
      this.cartservice.productsCountInCart = count;
    });
  }

  ngAfterViewInit() {
    this.debounceSearchInput();
  }

  drawerChanged(event:boolean){
  this.drawerOpened=event
  }
  debounceSearchInput() {
    fromEvent(this.input.nativeElement, 'input')
      .pipe(
        tap(() => {
          this.brandsOnSearch = [];
        }),
        filter(Boolean),
        debounceTime(1000),
        tap(() => {
          this.searchBrandsOnInput();
        })
      )
      .subscribe((data) => {});
  }

  methodToGetRoutes() {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.checkLogin = this.authentication.checkUserLogin();

        let [route, params] = event.url.split('?');
        if (!this.currentUrl?.includes('search')) {
          this.previousUrl = this.currentUrl;
        }
        this.currentUrl = event.url;
        let routes = ['/login', '/signup'];
        if (routes.includes(route)) {
          this.showProfile = false;
        } else {
          this.showProfile = true;
        }
      });
  }

  mousehover(event: Event) {
    event.stopPropagation();

    this.hover = true;
    if (this.checkLogin && !this.userName) {
      this.profileService.getProfileDetails().subscribe((data) => {
        this.userName = data.fullName || '';
      });
    }
  }

  mouseleave(event: Event) {
    event.stopPropagation();
    this.hover = false;
  }

  activeOnHover(element: HTMLParagraphElement, event: Event) {
    event.stopPropagation();
    let brands = document.querySelectorAll('.searchBrand');
    brands.forEach((el) => {
      el.classList.remove('activeOnHover');
    });

    element.classList.add('activeOnHover');
  }

  deactiveOnHover(element: HTMLParagraphElement, event: Event) {
    event.stopPropagation();
    element.classList.remove('activeOnHover');
  }

  searchBrandsOnInput() {
    if (this.searchValue) {
      this.productService
        .getBrandsOnSearch({ search: this.searchValue })
        .subscribe((data) => {
          this.brandsOnSearch = data;
          if (data.length === 0) {
            this.noBrands = true;

            setTimeout(() => {
              this.noBrands = false;
            }, 10000);
          } else {
            this.noBrands = false;
            setTimeout(() => {
              this.brandsOnSearch = [];
            }, 10000);
          }
        });
    }
  }

  searchProductsOnBrand(brand?: string) {
    if(this.noBrands){
     this.noBrands=false
     this.searchValue=''
     return
    }
    if (brand) {
      this.searchValue = brand;
    }
    if (this.searchValue) {
      this.productService.addQueryParametersToRoute({
        search: this.searchValue,
      });
    } else {
      let currenturl = this.currentUrl.includes('search')
        ? this.previousUrl
        : this.currentUrl;
      let [currentroute, currentparams] = currenturl.split('?');

      this.productService.addQueryParametersToRoute(
        {
          search: this.searchValue,
        },
        currentroute
      );
    }
    this.productService.queryParams.next({});
    this.searchValue = '';
  }

  searchProductsOnEnter(event: any) {
    if (event?.key === 'Enter') {
      this.searchProductsOnBrand();
    }
  }
 ngOnDestroy(): void {
  if(this.cartCount){
    this.cartCount.unsubscribe()
  }
 }
}

