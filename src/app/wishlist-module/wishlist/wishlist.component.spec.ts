import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';

import { WishlistComponent } from './wishlist.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { ActivatedRoute, Router, UrlSegment } from '@angular/router';
import { WishlistService } from 'src/app/services/wishlist/wishlist.service';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { httpService } from 'src/app/services/products/products.service';
import { wishlistProducts } from 'src/app/testing/mockData';
import { Subject, Subscriber, of } from 'rxjs';
import { SizelistComponent } from 'src/app/shared/matdialogs/sizelist/sizelist.component';

describe('WishlistComponent', () => {
  let component: WishlistComponent;
  let fixture: ComponentFixture<WishlistComponent>;
  let mockMatDialog: jasmine.SpyObj<MatDialog>;
  let mockMatSnackBar: jasmine.SpyObj<MatSnackBar>;
  let mockMatBottomSheet: jasmine.SpyObj<MatBottomSheet>;
  let mockActivatedRoute: ActivatedRoute;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockWishlistService: jasmine.SpyObj<WishlistService>;
  let mockAuthenticationService: jasmine.SpyObj<AuthenticationService>;
  let mockHttpService: jasmine.SpyObj<httpService>;
  beforeEach(async () => {
    mockMatDialog = jasmine.createSpyObj('MatDialog', ['open']);
    mockMatSnackBar = jasmine.createSpyObj('MatSnackBar', ['open']);
    mockMatBottomSheet = jasmine.createSpyObj('MatBottomSheet', ['open']);
    // mockActivatedRoute = jasmine.createSpyObj('ActivatedRoute', ['url']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockWishlistService = jasmine.createSpyObj('WishlistService', [
      'getMethod_ProductsInWishlist',
      'deleteMethod_toProductsInWishlist',
    ]);
    mockAuthenticationService = jasmine.createSpyObj('AuthenticationService', [
      'checkUserLogin',
    ]);
    mockHttpService = jasmine.createSpyObj('httpService', ['scrollToTop']);
    mockWishlistService.wishlistProducts = new Subject();
    await TestBed.configureTestingModule({
      declarations: [WishlistComponent],
      imports: [SharedModule],
      providers: [
        { provide: MatDialog, useValue: mockMatDialog },
        { provide: MatSnackBar, useValue: mockMatSnackBar },
        { provide: MatBottomSheet, useValue: mockMatBottomSheet },
        {
          provide: ActivatedRoute,
          useValue: {
            url: of([{ path: 'login' }]),
            params: of({ category: 'testCategory', id: 'testId' }),
            queryParams: of({ reference: 'wishlist' }),
          },
        },
        { provide: Router, useValue: mockRouter },
        { provide: WishlistService, useValue: mockWishlistService },
        { provide: AuthenticationService, useValue: mockAuthenticationService },
        { provide: httpService, useValue: mockHttpService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(WishlistComponent);
    mockActivatedRoute = TestBed.inject(ActivatedRoute);
    component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('onResize', () => {
    it('should call checkScreenWidth', () => {
      spyOn(component, 'checkScreenWidth');
      const event = new Event('resize');

      component.onResize(event);

      expect(component.checkScreenWidth).toHaveBeenCalled();
    });
  });
  describe('ngOnInit', () => {
    it('should call checkScreenWidth and scrollToTop and setCurrentRoute and dynamicCompData and chekcLogin is false', () => {
      mockAuthenticationService.checkUserLogin.and.returnValue(false);
      spyOn(component, 'checkScreenWidth');
      spyOn(component, 'setCurrentRoute');
      component.ngOnInit();
      expect(component.checkLogin).toBeFalsy();
      expect(component.checkScreenWidth).toHaveBeenCalled();
      expect(component.setCurrentRoute).toHaveBeenCalled();
      expect(component.dynamicCompData).toEqual({
        header: 'PLEASE LOG IN',
        paragraph: 'Login to view items in your wishlist.',
        buttonText: 'LOGIN',
      });
    });

    it('should call checkScreenWidth and scrollToTop and setCurrentRoute and dynamicCompData and chekcLogin is true call getMethod_ProductsInWishlist', () => {
      mockAuthenticationService.checkUserLogin.and.returnValue(true);
      spyOn(component, 'checkWishlistEmpty');
      spyOn(component, 'setCurrentRoute');
      mockWishlistService.getMethod_ProductsInWishlist.and.returnValue(
        of([{ products: wishlistProducts }])
      );
      component.ngOnInit();
      mockWishlistService.wishlistProducts.next(wishlistProducts);
      expect(component.products).toEqual(wishlistProducts);
      expect(component.productCount).toEqual(wishlistProducts.length);
      expect(component.checkWishlistEmpty).toHaveBeenCalled();
    });
  });

  describe('checkScreenWidth', () => {
    it('should set isMobileView to true if window width is less than or equal to 500', () => {
      spyOnProperty(window, 'innerWidth').and.returnValue(400);

      component.checkScreenWidth();

      expect(component.isMobileView).toBeTrue();
    });

    it('should set isMobileView to false if window width is greater than 500', () => {
      spyOnProperty(window, 'innerWidth').and.returnValue(600);

      component.checkScreenWidth();

      expect(component.isMobileView).toBeFalse();
    });
  });
  describe('setCurrentRoute', () => {
    it('should set the current route', fakeAsync(() => {
      mockActivatedRoute.url = of([{ path: 'mockPath' }] as UrlSegment[]);

      component.setCurrentRoute();
      tick();

      expect(component.url).toEqual('mockPath');
    }));
  });
  describe('openDialog', () => {
    it('should call dialogRef will open on isMobileView is false with required data', () => {
      component.isMobileView = false;
      component.products = wishlistProducts;
      mockMatDialog.open.and.returnValue({ afterClosed: () => of('') } as any);
      const event = jasmine.createSpyObj('Event', ['stopPropagation']);
      let newProduct = component.products.find((el) => {
        return el.id === 1102;
      });
      component.openDialog(event, 1102);
      expect(mockMatDialog.open).toHaveBeenCalledWith(SizelistComponent, {
        data: { wishlistproduct: newProduct, checkRoute: true },
      });
    });
    it('should call bottomSheet will open on isMobileView is true with required data', () => {
      component.isMobileView = true;
      component.products = wishlistProducts;
      mockMatBottomSheet.open.and.returnValue({
        afterDismissed: () => of(''),
      } as any);
      const event = jasmine.createSpyObj('Event', ['stopPropagation']);
      let newProduct = component.products.find((el) => {
        return el.id === 1102;
      });
      component.openDialog(event, 1102);
      expect(mockMatBottomSheet.open).toHaveBeenCalledWith(
        jasmine.any(Function),
        {
          data: {
            wishlistproduct: newProduct,
            checkRoute: true,
            mobileView: true,
          },
        }
      );
    });
  });
  describe('openSnackBar', () => {
    it('should open a snack bar with the provided message, action, and panelClass', () => {
      component.openSnackBar('Test Message', 'Test Action');

      expect(mockMatSnackBar.open).toHaveBeenCalledWith(
        'Test Message',
        'Test Action',
        {
          duration: 2000,
          verticalPosition: component.verticalPosition,
          horizontalPosition: component.horizontalPosition,
        }
      );
    });
  });

  describe('showAlert', () => {
    it('should call openSnackBar with the provided message and panelClass', () => {
      const openSnackBarSpy = spyOn(component, 'openSnackBar');

      component.showAlert('Test Message');

      expect(openSnackBarSpy).toHaveBeenCalledWith('Test Message', 'Close');
    });
  });

  describe('deleteProductMethod', () => {
    it('should call deleteMethod_toProductsInWishlist and getMethod_ProductsInWishlist and checkWishlistEmpty and showAlert and set products productCount', async () => {
      spyOn(component, 'showAlert');
      spyOn(component, 'checkWishlistEmpty');
      mockWishlistService.deleteMethod_toProductsInWishlist.and.returnValue(
        of({})
      );
      mockWishlistService.getMethod_ProductsInWishlist.and.returnValue(
        of([{ products: wishlistProducts }])
      );
      const event = jasmine.createSpyObj('Event', ['stopPropagation']);
      component.deleteProductMethod(1, event);
      expect(
        mockWishlistService.deleteMethod_toProductsInWishlist
      ).toHaveBeenCalled();
      expect(
        mockWishlistService.getMethod_ProductsInWishlist
      ).toHaveBeenCalled();
      expect(component.showAlert).toHaveBeenCalledWith(
        'item removed from wishlist'
      );
      expect(component.checkWishlistEmpty).toHaveBeenCalled();
      expect(component.productCount).toEqual(component.products.length);
      expect(component.products).toEqual(wishlistProducts);
    });
  });

  describe('navigateToProductDetails', () => {
    it('should navigate to correct route', () => {
      component.navigateToProductDetails(1, 'mens');
      expect(mockRouter.navigate).toHaveBeenCalledWith([
        '/products',
        'mens',
        1,
      ]);
    });
  });

  describe('ngOnDestroy', () => {
    it('should unsubscribe if wishlistProductsSubscription is there and checkLogin is true', () => {
      component.wishlistProductsSubscription = new Subscriber();
      spyOn(component.wishlistProductsSubscription, 'unsubscribe');
      component.checkLogin = true;
      component.ngOnDestroy();
      expect(
        component.wishlistProductsSubscription.unsubscribe
      ).toHaveBeenCalled();
    });

    it('should unsubscribe if wishlistProductsSubscription is there and checkLogin is false', () => {
      component.wishlistProductsSubscription = new Subscriber();
      spyOn(component.wishlistProductsSubscription, 'unsubscribe');
      component.checkLogin = false;
      component.ngOnDestroy();
      expect(
        component.wishlistProductsSubscription.unsubscribe
      ).not.toHaveBeenCalled();
    });
  });
});
