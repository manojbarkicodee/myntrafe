import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignupComponent } from './signup.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { CartService } from 'src/app/services/cart/cart.service';
import { ActivatedRoute, Router, UrlSegment } from '@angular/router';
import { Subject, of } from 'rxjs';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

describe('SignupComponent', () => {
  let component: SignupComponent;
  let fixture: ComponentFixture<SignupComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthenticationService>;
  let cartServiceSpy: jasmine.SpyObj<CartService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let activatedRouteSpy: ActivatedRoute;
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>;
  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthenticationService', [
      'authenticationMethod',
    ]);
    cartServiceSpy = jasmine.createSpyObj('CartService', ['getProductsCount']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);
    cartServiceSpy.productsCount = new Subject();
    // activatedRouteSpy = jasmine.createSpyObj('ActivatedRoute', ['queryParams']);
    await TestBed.configureTestingModule({
      declarations: [SignupComponent],
      imports: [SharedModule, ReactiveFormsModule, FormsModule],
      providers: [
        { provide: AuthenticationService, useValue: authServiceSpy },
        { provide: CartService, useValue: cartServiceSpy },
        { provide: Router, useValue: routerSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            url: of([{ path: 'login' }]),
            params: of({ category: 'testCategory', id: 'testId' }),
            queryParams: of({ reference: 'wishlist' }),
          },
        },
        { provide: MatSnackBar, useValue: snackBarSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SignupComponent);
    activatedRouteSpy = TestBed.inject(ActivatedRoute);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should initialize form controls and call query params and setCurrentUrl on ngOnInit', () => {
      spyOn(activatedRouteSpy.queryParams, 'subscribe');
      spyOn(component, 'setCurrentUrl');

      component.ngOnInit();

      fixture.detectChanges();
      const emailControl = component.signupform.controls['email'];
      expect(emailControl.validator).toEqual(jasmine.any(Function));
      const passwordControl = component.signupform.controls['password'];
      expect(passwordControl.validator).toEqual(jasmine.any(Function));

      expect(activatedRouteSpy.queryParams.subscribe).toHaveBeenCalledOnceWith(
        jasmine.any(Function)
      );
      expect(component.navigateTo).toEqual('wishlist');
      expect(component.setCurrentUrl).toHaveBeenCalled();
    });
  });

  describe('setCurrentUrl', () => {
    it('should set url and check for login and false if url is not login', () => {
      activatedRouteSpy.url = of([{ path: 'mockUrl' } as UrlSegment]);
      component.setCurrentUrl();
      expect(component.url).toEqual('mockUrl');
    });
    it('should set url and check for login and true if url is login', () => {
      component.setCurrentUrl();
      expect(component.url).toEqual('login');
      expect(component.isLogin).toBe(true);
    });
  });

  describe('onSubmit', () => {
    it('should handle successful login', () => {
      spyOn(cartServiceSpy.productsCount, 'next');
      spyOn(component, 'showAlert');
      let loginResponse = {
        statusCode: 200,
        token:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJtYW5vakBnbWFpbC5jb20iLCJpYXQiOjE3MDQ4ODUzMjJ9.ykrNlpUPxhe-JVUjR8jsENlWfmR09uGWrAqsCVT0I7M',
        message: 'Login successfull',
      };
      authServiceSpy.authenticationMethod.and.returnValue(of(loginResponse));
      cartServiceSpy.getProductsCount.and.returnValue(
        of({ productsCount: 10 })
      );
      spyOn(localStorage, 'setItem');

      component.onSubmit();

      expect(authServiceSpy.authenticationMethod).toHaveBeenCalledWith(
        component.signupform.value,
        '/login'
      );
      expect(authServiceSpy.token).toBe(
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJtYW5vakBnbWFpbC5jb20iLCJpYXQiOjE3MDQ4ODUzMjJ9.ykrNlpUPxhe-JVUjR8jsENlWfmR09uGWrAqsCVT0I7M'
      );
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'token',
        JSON.stringify(
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJtYW5vakBnbWFpbC5jb20iLCJpYXQiOjE3MDQ4ODUzMjJ9.ykrNlpUPxhe-JVUjR8jsENlWfmR09uGWrAqsCVT0I7M'
        )
      );
      expect(routerSpy.navigate).toHaveBeenCalledWith([
        component.navigateTo ? component.navigateTo : '/',
      ]);
      expect(cartServiceSpy.getProductsCount).toHaveBeenCalledOnceWith();
      expect(cartServiceSpy.productsCount.next).toHaveBeenCalledWith(10);
      expect(component.showAlert).toHaveBeenCalledWith(loginResponse.message);
    });

    it('should handle successful signup', () => {
      component.url = 'signup';
      spyOn(cartServiceSpy.productsCount, 'next');
      spyOn(component, 'onChangeMode');
      spyOn(component, 'showAlert');
      let loginResponse = {
        message: 'signup successfull',
        status: 'created',
        statusCode: 201,
      };
      authServiceSpy.authenticationMethod.and.returnValue(of(loginResponse));
      cartServiceSpy.getProductsCount.and.returnValue(
        of({ productsCount: 10 })
      );
      spyOn(localStorage, 'setItem');

      component.onSubmit();

      expect(authServiceSpy.authenticationMethod).toHaveBeenCalledWith(
        component.signupform.value,
        '/signup'
      );
      expect(localStorage.setItem).not.toHaveBeenCalledWith(
        'token',
        JSON.stringify(
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJtYW5vakBnbWFpbC5jb20iLCJpYXQiOjE3MDQ4ODUzMjJ9.ykrNlpUPxhe-JVUjR8jsENlWfmR09uGWrAqsCVT0I7M'
        )
      );
      expect(routerSpy.navigate).not.toHaveBeenCalledWith([
        component.navigateTo ? component.navigateTo : '/',
      ]);
      expect(cartServiceSpy.getProductsCount).not.toHaveBeenCalledOnceWith();
      expect(cartServiceSpy.productsCount.next).not.toHaveBeenCalledWith(10);
      expect(component.onChangeMode).toHaveBeenCalledWith('login');
      expect(component.showAlert).toHaveBeenCalledWith(loginResponse.message);
    });
  });

  describe('openSnackBar', () => {
    it('should open a snack bar with the provided message, action, and panelClass', () => {
      component.openSnackBar('Test Message', 'Test Action');

      expect(snackBarSpy.open).toHaveBeenCalledWith(
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

  describe('onChangeMode', () => {
    it('should set login to true if endPoint is login', () => {
      component.onChangeMode('login');
      expect(component.isLogin).toBeTruthy();
      expect(routerSpy.navigate).toHaveBeenCalledWith(['login'], {
        queryParamsHandling: 'preserve',
      });
    });
    it('should set login to false if endPoint is login', () => {
      component.onChangeMode('test');
      expect(component.isLogin).toBeFalsy();
      expect(routerSpy.navigate).toHaveBeenCalledWith(['test'], {
        queryParamsHandling: 'preserve',
      });
    });
  });

  describe('passwordpatternValidator',()=>{
    it('should return null for a valid password', () => {
      const control = new FormControl('Abc@1234');
  
      const result = component.passwordpatternValidator(control);
  
      expect(result).toBeNull();
    });
    it('should return { Upper: true } for a password without uppercase letters', () => {
      const control = new FormControl('abc@1234');
  
      const result = component.passwordpatternValidator(control);
  
      expect(result).toEqual({ Upper: true });
    });
  
    it('should return { lower: true } for a password without lowercase letters', () => {
      const control = new FormControl('ABC@1234');
  
      const result = component.passwordpatternValidator(control);
  
      expect(result).toEqual({ lower: true });
    });
  
    it('should return { special: true } for a password without special characters', () => {
      const control = new FormControl('Abc1234');
  
      const result = component.passwordpatternValidator(control);
  
      expect(result).toEqual({ special: true });
    });
  
    it('should return { Number: true } for a password without numbers', () => {
      const control = new FormControl('Abc@XYZ');
  
      const result = component.passwordpatternValidator(control);
  
      expect(result).toEqual({ Number: true });
    });
  })
});
