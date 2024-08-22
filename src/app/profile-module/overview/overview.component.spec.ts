import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OverviewComponent } from './overview.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { ProfileService } from 'src/app/services/profile/profile.service';
import { CartService } from 'src/app/services/cart/cart.service';
import { dashboardElements } from '../staticdata';
import { Subject, of } from 'rxjs';
import { profileDetails } from 'src/app/testing/mockData';

describe('OverviewComponent', () => {
  let component: OverviewComponent;
  let fixture: ComponentFixture<OverviewComponent>;
  let routerSpy: jasmine.SpyObj<Router>;
  let authServiceSpy: jasmine.SpyObj<AuthenticationService>;
  let profileServiceSpy: jasmine.SpyObj<ProfileService>;
  let cartServiceSpy: jasmine.SpyObj<CartService>;
  beforeEach(async () => {
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);
    const authServiceSpyObj = jasmine.createSpyObj('AuthenticationService', [
      'logoutMethod',
    ]);
    const profileServiceSpyObj = jasmine.createSpyObj('ProfileService', [
      'getProfileDetails',
    ]);
    const cartServiceSpyObj = jasmine.createSpyObj('CartService', [
      'productsCount',
    ]);
    await TestBed.configureTestingModule({
      declarations: [OverviewComponent],
      imports: [HttpClientTestingModule],
      providers: [
        { provide: Router, useValue: routerSpyObj },
        { provide: AuthenticationService, useValue: authServiceSpyObj },
        { provide: ProfileService, useValue: profileServiceSpyObj },
        { provide: CartService, useValue: cartServiceSpyObj },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(OverviewComponent);
    component = fixture.componentInstance;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    authServiceSpy = TestBed.inject(
      AuthenticationService
    ) as jasmine.SpyObj<AuthenticationService>;
    profileServiceSpy = TestBed.inject(
      ProfileService
    ) as jasmine.SpyObj<ProfileService>;
    cartServiceSpy = TestBed.inject(CartService) as jasmine.SpyObj<CartService>;
    cartServiceSpy.productsCount = new Subject();

    profileServiceSpy.getProfileDetails.and.returnValue(of(profileDetails));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should check screen width on initialization', async () => {
      spyOn(component, 'checkScreenWidth');
      component.dashboardElements = dashboardElements;
      profileServiceSpy.getProfileDetails.and.returnValue(of(profileDetails));
      await component.ngOnInit();

      expect(component.checkScreenWidth).toHaveBeenCalled();
    });

    it('should set dashboardElements from static data on initialization', () => {
      profileServiceSpy.getProfileDetails.and.returnValue(of(profileDetails));

      component.ngOnInit();
      expect(component.dashboardElements).toEqual(dashboardElements);
    });

    it('should set emailId from profile service data on initialization', () => {
      profileServiceSpy.getProfileDetails.and.returnValue(of(profileDetails));

      component.ngOnInit();
      expect(component.emailId).toBe('test@gmail.com');
    });
  });

  describe('navigateToNextRoute', () => {
    it('should navigate to profile/orders when title is "Orders"', () => {
      component.navigateToNextRoute('Orders');

      expect(routerSpy.navigate).toHaveBeenCalledWith(['profile/orders']);
    });

    it('should navigate to /wishlist when title is "Collections & Wishlist"', () => {
      component.navigateToNextRoute('Collections & Wishlist');

      expect(routerSpy.navigate).toHaveBeenCalledWith(['/wishlist']);
    });

    it('should navigate to /profile when title is "Profile Details"', () => {
      component.navigateToNextRoute('Profile Details');

      expect(routerSpy.navigate).toHaveBeenCalledWith(['/profile']);
    });

    it('should navigate to profile/cards when title is "Saved Cards"', () => {
      component.navigateToNextRoute('Saved Cards');

      expect(routerSpy.navigate).toHaveBeenCalledWith(['profile/cards']);
    });

    it('should navigate to profile/addresses when title is "Addresses"', () => {
      component.navigateToNextRoute('Addresses');

      expect(routerSpy.navigate).toHaveBeenCalledWith(['profile/addresses']);
    });
  });

  describe('onResize', () => {
    it('should call checkScreenWidth on window resize', () => {
      spyOn(component, 'checkScreenWidth');

      window.dispatchEvent(new Event('resize'));

      expect(component.checkScreenWidth).toHaveBeenCalled();
    });
  });
  describe('checkScreenWidth', () => {
    it('should set isMobileView to true when window.innerWidth is less than or equal to 500', () => {
      spyOnProperty(window, 'innerWidth', 'get').and.returnValue(480);
      component.checkScreenWidth();

      expect(component.isMobileView).toBeTruthy();
    });

    it('should set isMobileView to false when window.innerWidth is greater than 500', () => {
      spyOnProperty(window, 'innerWidth', 'get').and.returnValue(600);
      component.checkScreenWidth();

      expect(component.isMobileView).toBeFalsy();
    });
  });

  describe('logoutMethod', () => {
    it('should call logoutMethod and reset productsCount on logoutMethod', () => {
      spyOn(cartServiceSpy.productsCount, 'next');
      component.logoutMethod();
      expect(authServiceSpy.logoutMethod).toHaveBeenCalled();
      expect(cartServiceSpy.productsCount.next).toHaveBeenCalledWith(0);
    });
  });
});
