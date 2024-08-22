import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';

import { ProductDetailsComponent } from './product.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterTestingModule } from '@angular/router/testing';
import { ProductService } from 'src/app/services/product/product.service';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { WishlistService } from 'src/app/services/wishlist/wishlist.service';
import { CartService } from 'src/app/services/cart/cart.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgbCarousel, NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import {
  product,
  similarProducts,
  wishlistProducts,
} from 'src/app/testing/mockData';
import { Subject, of } from 'rxjs';
import {
  ProductdeliveryInformation,
  bestOffers,
  otherDetails,
} from './staticData';
import { ActivatedRoute, Router } from '@angular/router';
import { productDetails } from '../model';

describe('IndivisualProductComponent', () => {
  let component: ProductDetailsComponent;
  let fixture: ComponentFixture<ProductDetailsComponent>;
  let productService: jasmine.SpyObj<ProductService>;
  let authService: jasmine.SpyObj<AuthenticationService>;
  let wishlistService: jasmine.SpyObj<WishlistService>;
  let cartService: jasmine.SpyObj<CartService>;
  let snackBar: jasmine.SpyObj<MatSnackBar>;
  let activatedRoute: ActivatedRoute;
  let router: Router;
  let routerMock: any;
  beforeEach(async () => {
    productService = jasmine.createSpyObj('ProductService', [
      'getProductById',
      'getSimilarProductsbyCategory',
    ]);
    authService = jasmine.createSpyObj('AuthenticationService', [
      'checkUserLogin',
    ]);
    wishlistService = jasmine.createSpyObj('WishlistService', [
      'getMethod_ProductsInWishlist',
      'postMethod_AddProductsToWishlist',
    ]);
    cartService = jasmine.createSpyObj('CartService', [
      'postMethod_AddProductsToCart',
    ]);
    snackBar = jasmine.createSpyObj('MatSnackBar', ['open']);
    routerMock = { navigate: jasmine.createSpy('navigate') };
    cartService.productsCount = new Subject();
    await TestBed.configureTestingModule({
      declarations: [ProductDetailsComponent],
      imports: [HttpClientTestingModule, SharedModule, NgbCarouselModule],
      providers: [
        { provide: ProductService, useValue: productService },
        { provide: AuthenticationService, useValue: authService },
        { provide: WishlistService, useValue: wishlistService },
        { provide: CartService, useValue: cartService },
        { provide: MatSnackBar, useValue: snackBar },
        { provide: Router, useValue: routerMock },
        {
          provide: ActivatedRoute,
          useValue: {
            url: of([{ path: 'mockPath' }]),
            params: of({ category: 'testCategory', id: 'testId' }),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductDetailsComponent);
    component = fixture.componentInstance;
    activatedRoute = TestBed.inject(ActivatedRoute);
    // router=TestBed.inject(Router)
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should call checkScreenWidth and set values to deliveryInfo,offersInfo,otherDetails', () => {
      spyOn(component, 'checkScreenWidth');
      const mockProductData: productDetails = product;
      const mockSimilarProductsData = similarProducts;

      activatedRoute.params = of({ category: 'mockCategory', id: 'mockId' });

      productService.getProductById.and.returnValue(of(mockProductData));
      productService.getSimilarProductsbyCategory.and.returnValue(
        of(mockSimilarProductsData)
      );
      component.ngOnInit();
      expect(component.checkScreenWidth).toHaveBeenCalled();
      expect(component.deliveryInfo).toEqual(ProductdeliveryInformation);
      expect(component.offersInfo).toEqual(bestOffers);
      expect(component.otherDetails).toEqual(otherDetails);
    });
    it('should initialize component and fetch product data and should call activeWishlistedProduct on checkUserLogin true', fakeAsync(() => {
      const mockProductData: productDetails = product;
      const mockSimilarProductsData = similarProducts;
      spyOn(component, 'activeWishlistedProduct');
      activatedRoute.params = of({ category: 'mockCategory', id: 'mockId' });

      productService.getProductById.and.returnValue(of(mockProductData));
      productService.getSimilarProductsbyCategory.and.returnValue(
        of(mockSimilarProductsData)
      );
      authService.checkUserLogin.and.returnValue(true);
      wishlistService.getMethod_ProductsInWishlist.and.returnValue(
        of([{ products: wishlistProducts }])
      );
      component.ngOnInit();
      tick();
      expect(component.activeWishlistedProduct).toHaveBeenCalled();
      expect(component.category).toBe('mockCategory');
      expect(component.product).toEqual(mockProductData);
      expect(component.similarProducts).toEqual(mockSimilarProductsData);
    }));
    it('should initialize component and fetch product data and should not call activeWishlistedProduct on checkUserLogin false', fakeAsync(() => {
      const mockProductData: productDetails = product;
      const mockSimilarProductsData = similarProducts;
      spyOn(component, 'activeWishlistedProduct');
      activatedRoute.params = of({ category: 'mockCategory', id: 'mockId' });

      productService.getProductById.and.returnValue(of(mockProductData));
      productService.getSimilarProductsbyCategory.and.returnValue(
        of(mockSimilarProductsData)
      );
      authService.checkUserLogin.and.returnValue(false);
      component.ngOnInit();
      tick();
      expect(component.activeWishlistedProduct).not.toHaveBeenCalled();
    }));
  });

  describe('checkScreenWidth', () => {
    it('should set isMobileView to true if window width is less than or equal to 900', () => {
      spyOnProperty(window, 'innerWidth').and.returnValue(400);

      component.checkScreenWidth();

      expect(component.isMobileView).toBeTrue();
    });

    it('should set isMobileView to false if window width is greater than 900', () => {
      spyOnProperty(window, 'innerWidth').and.returnValue(1000);

      component.checkScreenWidth();

      expect(component.isMobileView).toBeFalse();
    });
  });

  describe('onResize', () => {
    it('should call checkScreenWidth', () => {
      spyOn(component, 'checkScreenWidth');
      const event = new Event('resize');

      component.onResize(event);

      expect(component.checkScreenWidth).toHaveBeenCalled();
    });
  });

  describe('setCurrentUrl', () => {
    it('should set currentUrl property based on ActivatedRoute data', () => {
      component.setCurrentUrl();

      expect(component.currentUrl).toBe('mockPath');
    });
  });

  describe('openSnackBar', () => {
    it('should open a snack bar with the provided message, action, and panelClass', () => {
      component.openSnackBar('Test Message', 'Test Action', 'test-panel-class');

      expect(snackBar.open).toHaveBeenCalledWith(
        'Test Message',
        'Test Action',
        {
          duration: 2000,
          verticalPosition: component.verticalPosition,
          horizontalPosition: component.horizontalPosition,
          panelClass: ['test-panel-class'],
        }
      );
    });
  });

  describe('showAlert', () => {
    it('should call openSnackBar with the provided message and panelClass', () => {
      const openSnackBarSpy = spyOn(component, 'openSnackBar');

      component.showAlert('Test Message', 'test-panel-class');

      expect(openSnackBarSpy).toHaveBeenCalledWith(
        'Test Message',
        'Close',
        'test-panel-class'
      );
    });
  });

  describe('selectSize', () => {
    it('should make selected size as active and set sizeElement to selected size', () => {
      let divElement = document.createElement('div');
      divElement.innerText = 's';
      spyOn(divElement.classList, 'add');
      component.selectSize('s', divElement);
      expect(divElement.classList.add).toHaveBeenCalledOnceWith('onSelect');
      expect(component.sizeElement).toEqual(divElement);
    });

    it('should unactive previous selected size on new slection', () => {
      let divElement = document.createElement('div');
      divElement.innerText = 's';
      component.sizeElement = document.createElement('div') as HTMLDivElement;
      component.sizeElement.innerText = 'm';
      let element = component.sizeElement;
      spyOn(element['classList'], 'remove');
      component.selectSize('s', divElement);
      expect(element.classList.remove).toHaveBeenCalledWith('onSelect');
      expect(component.sizeElement).toEqual(divElement);
    });
  });

  describe('addProductsToBag', () => {
    it('should check for userLogin and if not navigate to signup page', () => {
      authService.checkUserLogin.and.returnValue(false);
      component.currentUrl = 'test/url';
      component.addProductsToBag(1);
      expect(routerMock.navigate).toHaveBeenCalledOnceWith(['/signup'], {
        queryParams: { reference: component.currentUrl },
      });
    });

    it('should set showSizeAlert to true if user logged in and size is not selected', () => {
      authService.checkUserLogin.and.returnValue(true);
      component.addProductsToBag(1);
      expect(component.showSizeAlert).toBe(true);
    });

    it('should set showSizeAlert to false if user is logged in and size is selected and goto bag is true navigate to cart', () => {
      authService.checkUserLogin.and.returnValue(true);
      component.size = 's';
      component.goToBag = true;
      component.addProductsToBag(1);
      expect(component.showSizeAlert).toBe(false);
      expect(routerMock.navigate).toHaveBeenCalledWith(['/cart']);
    });

    it('should call postMethod_AddProductsToCart on gotobag is false', () => {
      let mockSuccess = {
        statusCode: 201,
        status: 'added successfuly',
        message: 'product added to cart',
      };
      spyOn(component, 'showAlert');
      spyOn(cartService.productsCount, 'next');
      authService.checkUserLogin.and.returnValue(true);
      cartService.postMethod_AddProductsToCart.and.returnValue(of(mockSuccess));
      component.size = 's';
      component.goToBag = false;
      component.addProductsToBag(1);
      expect(component.showSizeAlert).toBe(false);
      expect(cartService.productsCount.next).toHaveBeenCalledOnceWith(
        cartService.productsCountInCart + 1
      );
      expect(component.goToBag).toBe(true);
      expect(component.showAlert).toHaveBeenCalledWith(
        'product added to cart',
        'success'
      );
    });
  });

  describe('activeWishlistedProduct', () => {
    it('should call getMethod_ProductsInWishlist if product and wishlist product match set wishlisted to true ', () => {
      wishlistService.getMethod_ProductsInWishlist.and.returnValue(
        of([{ products: wishlistProducts }])
      );
      let mockProducts = { ...product, wishlisted: false };
      component.product = mockProducts;

      component.activeWishlistedProduct();
      expect(wishlistService.getMethod_ProductsInWishlist).toHaveBeenCalled();
      expect(component.product.wishlisted).toBe(true);
    });
    it('should call getMethod_ProductsInWishlist if product and wishlist product doesn"t match set wishlisted to false ', () => {
      wishlistService.getMethod_ProductsInWishlist.and.returnValue(
        of([{ products: wishlistProducts }])
      );
      let mockProducts = { ...product, wishlisted: false };
      mockProducts.id = 1052;
      component.product = mockProducts;

      component.activeWishlistedProduct();
      expect(wishlistService.getMethod_ProductsInWishlist).toHaveBeenCalled();
      expect(component.product.wishlisted).toBe(false);
    });
  });

  describe('addProductToWishlist',()=>{
    it('should check for userLogin and if not navigate to signup page', () => {
      authService.checkUserLogin.and.returnValue(false);
      component.currentUrl = 'test/url';
      component.addProductToWishlist(1);
      expect(routerMock.navigate).toHaveBeenCalledOnceWith(['/signup'], {
        queryParams: { reference: component.currentUrl },
      });
    });

    it('should not call postMethod_AddProductsToWishlist on userlogged in wishlisted is true',()=>{
      authService.checkUserLogin.and.returnValue(true);
      component.product={...product,wishlisted:true};
      component.addProductToWishlist(1)
      expect(wishlistService.postMethod_AddProductsToWishlist).not.toHaveBeenCalled()
    })

    it('should call postMethod_AddProductsToWishlist on userlogged in wishlisted is false and set wishlisted to true and call showAlert',()=>{
      spyOn(component,'showAlert')
      authService.checkUserLogin.and.returnValue(true);
      component.product={...product,wishlisted:false};
      let mockSuccess={
        "statusCode": 201,
        "status": "added successfuly",
        "message": "1 items added to wishlist"
    }
      wishlistService.postMethod_AddProductsToWishlist.and.returnValue(of(mockSuccess))
      component.addProductToWishlist(1)
      expect(wishlistService.postMethod_AddProductsToWishlist).toHaveBeenCalled()
      expect(component.product.wishlisted).toBe(true);
      expect(component.showAlert).toHaveBeenCalledOnceWith(mockSuccess.message,'success')
    })
  })
});
