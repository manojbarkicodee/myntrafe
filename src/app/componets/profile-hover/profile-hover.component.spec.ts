import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ProfileHoverComponent } from './profile-hover.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { Subject } from 'rxjs';
import { Router, RouterEvent } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { CartService } from 'src/app/services/cart/cart.service';

describe('ProfileHoverComponent', () => {
  let component: ProfileHoverComponent;
  let fixture: ComponentFixture<ProfileHoverComponent>;
  let mockAuthService: jasmine.SpyObj<AuthenticationService>;
  let mockCartService: jasmine.SpyObj<CartService>;
  let mockRouter: any;
  beforeEach(async () => {
    mockAuthService = jasmine.createSpyObj('AuthenticationService', [
      'logoutMethod',
    ]);
    mockCartService = jasmine.createSpyObj('CartService', [
      'getMethod_GetCartProducts',
      '',
    ]);
    mockCartService.productsCount = new Subject();
    mockRouter = { navigate: jasmine.createSpy('navigate') };
    await TestBed.configureTestingModule({
      declarations: [ProfileHoverComponent],
      imports: [SharedModule, HttpClientTestingModule],
      providers: [
        { provide: AuthenticationService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
        { provide: CartService, useValue: mockCartService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileHoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
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
  describe('navigateToSignUp', () => {
    it('should navigate to /signup with queryParams and set hover to false', () => {
      component.url = 'some-url';
      component.navigateToSignUp();

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/signup'], {
        queryParams: { reference: 'some-url' },
      });
      expect(component.hover).toBeFalse();
    });
  });
  describe('ngOnInit', () => {
    it('should call checkScreenWidth', () => {
      spyOn(component, 'checkScreenWidth');
      component.ngOnInit();
      expect(component.checkScreenWidth).toHaveBeenCalled();
    });
  });
  describe('logoutMethod', () => {
    it('should call logoutMethod of AuthenticationService, set checkLogin to false, and set productsCount to 0', () => {
      component.checkLogin = true;
      spyOn(mockCartService.productsCount, 'next');
      component.logoutMethod();

      expect(mockAuthService.logoutMethod).toHaveBeenCalled();
      expect(component.checkLogin).toBeFalse();
      expect(mockCartService.productsCount.next).toHaveBeenCalledWith(0);
    });
  });
  describe('closeProfile', () => {
    it('should set hover to be false', () => {
      component.closeProfile();
      expect(component.hover).toBe(false);
    });
  });
});
