import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { IndivisualProductComponent } from './individual-product.component';
import { RouterTestingModule } from '@angular/router/testing';
import { SharedModule } from 'src/app/shared/shared.module';
import { CarouselComponent } from '../carousel/carousel.component';
import { ActivatedRoute, Router, UrlSegment } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { WishlistService } from 'src/app/services/wishlist/wishlist.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of, throwError } from 'rxjs';
import { product } from 'src/app/testing/mockData';

describe('IndivisualProductComponent', () => {
  let component: IndivisualProductComponent;
  let fixture: ComponentFixture<IndivisualProductComponent>;
  let authService: jasmine.SpyObj<AuthenticationService>;
  let route: ActivatedRoute;
  let wishlistService: jasmine.SpyObj<WishlistService>;
  let snackBar: jasmine.SpyObj<MatSnackBar>;
  let router: jasmine.SpyObj<Router>;
  beforeEach(async () => {
    authService = jasmine.createSpyObj('AuthenticationService', [
      'checkUserLogin',
    ]);
    wishlistService = jasmine.createSpyObj('WishlistService', [
      'postMethod_AddProductsToWishlist',
    ]);
    snackBar = jasmine.createSpyObj('MatSnackBar', ['open']);
    router = jasmine.createSpyObj('Router', ['navigate']);
    await TestBed.configureTestingModule({
      declarations: [IndivisualProductComponent, CarouselComponent],
      imports: [HttpClientTestingModule, SharedModule],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            url: of([{ path: 'mockPath' }] as UrlSegment[]),
            params: of({ category: 'testCategory' }),
          },
        },
        { provide: WishlistService, useValue: wishlistService },
        { provide: MatSnackBar, useValue: snackBar },
        { provide: Router, useValue: router },
        { provide: AuthenticationService, useValue: authService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(IndivisualProductComponent);
    route = TestBed.inject(ActivatedRoute);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('setCurrentRoute', () => {
    it('should set the current route', fakeAsync(() => {
      route.url = of([{ path: 'mockPath' }] as UrlSegment[]);

      component.setCurrentRoute();
      tick();

      expect(component.url).toEqual('mockPath');
    }));
  });

  describe('openSnackBar', () => {
    it('should open a snack bar with the provided parameters', () => {
      component.openSnackBar('Test Message', 'Test Action', 'test-panel-class');

      expect(snackBar.open).toHaveBeenCalledWith(
        'Test Message',
        'Test Action',
        jasmine.objectContaining({
          duration: 2000,
          verticalPosition: 'top',
          horizontalPosition: 'center',
          panelClass: ['test-panel-class'],
        })
      );
    });
  });

  describe('showAlert', () => {
    it('should call openSnackBar with success panel class', () => {
      spyOn(component, 'openSnackBar');
      component.showAlert('Test Message', 'success');
      expect(component.openSnackBar).toHaveBeenCalledWith(
        'Test Message',
        'Close',
        'success'
      );
    });

    it('should call openSnackBar with error panel class', () => {
      spyOn(component, 'openSnackBar');
      component.showAlert('Test Message', 'error');
      expect(component.openSnackBar).toHaveBeenCalledWith(
        'Test Message',
        'Close',
        'error'
      );
    });
  });

  describe('mousehover and mouseleave', () => {
    it('should set indicators to true on mousehover', () => {
      component.mousehover();
      expect(component.indicators).toBe(true);
    });

    it('should set indicators to false on mouseleave', () => {
      component.mouseleave();
      expect(component.indicators).toBe(false);
    });
  });

  describe('addProductToWishlist', () => {
    it('should navigate to signup if user is not logged in', () => {
      authService.checkUserLogin.and.returnValue(false);
      route.url = of([{ path: 'mockPath' }] as UrlSegment[]);
      component.url = 'test';
      component.addProductToWishlist(new Event('click'), 1);

      expect(router.navigate).toHaveBeenCalledWith(['/signup'], {
        queryParams: { reference: 'test' },
      });
    });

    it('should call wishlist service and show success alert if user is logged in', fakeAsync(() => {
      authService.checkUserLogin.and.returnValue(true);
      component.product = { ...product, wishlisted: false };
      spyOn(component, 'showAlert');
      wishlistService.postMethod_AddProductsToWishlist.and.returnValue(
        of({ message: 'Wishlist item added' })
      );

      component.addProductToWishlist(new Event('click'), 1);
      tick();

      expect(
        wishlistService.postMethod_AddProductsToWishlist
      ).toHaveBeenCalledWith([{ productId: 1 }]);
      expect(component.product.wishlisted).toBe(true);
      expect(component.showAlert).toHaveBeenCalledWith(
        'Wishlist item added',
        'success'
      );
    }));

    it('should show error alert if there is an error in wishlist service', fakeAsync(() => {
      authService.checkUserLogin.and.returnValue(true);
      component.product = { ...product, wishlisted: false };
      spyOn(component, 'showAlert');
      wishlistService.postMethod_AddProductsToWishlist.and.returnValue(
        throwError({ error: { message: 'Error message' } })
      );

      component.addProductToWishlist(new Event('click'), 1);
      tick();

      expect(component.showAlert).toHaveBeenCalledWith(
        'Something went wrong,Please try again later!',
        'error'
      );
    }));
    it('should stop event propagation', () => {
      authService.checkUserLogin.and.returnValue(true);
      component.product = { ...product, wishlisted: false };
      wishlistService.postMethod_AddProductsToWishlist.and.returnValue(
        of({ message: 'Wishlist item added' })
      );
      const event = new Event('click');
      const stopPropagationSpy = spyOn(event, 'stopPropagation');

      component.addProductToWishlist(event, 1);

      expect(stopPropagationSpy).toHaveBeenCalled();
    });
  });
});
