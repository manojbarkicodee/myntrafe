
import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import {
  BehaviorSubject,
  Observable,
  ReplaySubject,
  Subject,
  Subscriber,
  debounceTime,
  filter,
  fromEvent,
  of,
  tap,
} from 'rxjs';
import { NavbarComponent } from './navbar.component';
import { httpService } from 'src/app/services/products/products.service';
import { CartService } from 'src/app/services/cart/cart.service';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { ProfileService } from 'src/app/services/profile/profile.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { NavigationEnd, Router, RouterEvent } from '@angular/router';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SignupComponent } from 'src/app/userModule/Auth/signup.component';
import { HomeComponent } from 'src/app/home/homepage/home.component';
import {
  brandsOnsearch,
  cartProductsData,
  profileDetails,
} from 'src/app/testing/mockData';
import { cardresponse } from 'src/app/cart-module/model';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let mockHttpService: jasmine.SpyObj<httpService>;
  let mockCartService: jasmine.SpyObj<CartService>;
  let mockAuthService: jasmine.SpyObj<AuthenticationService>;
  let mockProfileService: jasmine.SpyObj<ProfileService>;
  let eventSubject = new ReplaySubject<RouterEvent>(1);
  let routerMock = {
    navigate: jasmine.createSpy('navigate'),
    events: eventSubject.asObservable(),
    url: 'test/url',
  };
  beforeEach(waitForAsync(() => {
    mockHttpService = jasmine.createSpyObj('httpService', [
      'getBrandsOnSearch',
      'addQueryParametersToRoute',
    ]);
    mockCartService = jasmine.createSpyObj('CartService', [
      'getMethod_GetCartProducts',
      '',
    ]);
    mockAuthService = jasmine.createSpyObj('AuthenticationService', [
      'checkUserLogin',
    ]);
    mockProfileService = jasmine.createSpyObj('ProfileService', [
      'getProfileDetails',
    ]);
    mockCartService.cards = new Subject();

    mockCartService.productsCount = new Subject();
    mockHttpService.queryParams = new Subject();

    TestBed.configureTestingModule({
      declarations: [NavbarComponent],
      imports: [
        // RouterTestingModule.withRoutes([
        //   { path: 'login', component: SignupComponent },
        //   {
        //     path: '',
        //     pathMatch: 'full',
        //     component: HomeComponent,
        //   },
        // ]),
        SharedModule,
        HttpClientTestingModule,
      ],
      providers: [
        { provide: httpService, useValue: mockHttpService },
        { provide: CartService, useValue: mockCartService },
        { provide: AuthenticationService, useValue: mockAuthService },
        { provide: ProfileService, useValue: mockProfileService },
        { provide: Router, useValue: routerMock },
      ],
    });
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should call methodToGetRoutes', () => {
      spyOn(component, 'methodToGetRoutes');

      component.ngOnInit();

      expect(component.methodToGetRoutes).toHaveBeenCalled();
    });

    it('should call getMethod_GetCartProducts and update productsCount if checkLogin is true', fakeAsync(() => {
      mockAuthService.checkUserLogin.and.returnValue(true);
      const mockData = [{ products: cartProductsData }];
      mockCartService.getMethod_GetCartProducts.and.returnValue(of(mockData));

      component.ngOnInit();
      mockCartService.productsCount.next(mockData[0].products.length);
      tick();

      expect(component.checkLogin).toBe(true);
      expect(mockCartService.getMethod_GetCartProducts).toHaveBeenCalled();
      expect(mockCartService.productsCountInCart).toEqual(
        mockData[0].products.length
      );
    }));

    it('should not call getMethod_GetCartProducts if checkLogin is false', () => {
      mockAuthService.checkUserLogin.and.returnValue(false);

      component.ngOnInit();

      expect(mockCartService.getMethod_GetCartProducts).not.toHaveBeenCalled();
    });

    it('should subscribe to productsCount and update cartProductsCount and productsCountInCart', fakeAsync(() => {
      const mockCount = 3;

      component.ngOnInit();
      mockCartService.productsCount.next(mockCount);

      tick();

      expect(component.cartProductsCount).toEqual(mockCount);
      expect(mockCartService.productsCountInCart).toEqual(mockCount);
    }));
  });

  describe('ngAfterViewInit', () => {
    it('should call debounceSearchInput', () => {
      spyOn(component, 'debounceSearchInput');
      component.ngAfterViewInit();
      expect(component.debounceSearchInput).toHaveBeenCalled();
    });
  });

  describe('drawerChanged', () => {
    it('should up drawer opened true if event return true', () => {
      component.drawerChanged(true);
      expect(component.drawerOpened).toBe(true);
    });
  });
  describe('debounceSearchInput', () => {
    it('should debounce search input and call searchBrandsOnInput', fakeAsync(() => {
      spyOn(component, 'searchBrandsOnInput');

      component.ngAfterViewInit();
      const inputElement = fixture.debugElement.query(
        By.css('input')
      ).nativeElement;
      const inputEvent = new Event('input');
      inputElement.value = 'Some input value';
      inputElement.dispatchEvent(inputEvent);
      expect(component.brandsOnSearch).toEqual([]);
      tick(1000);

      expect(component.searchBrandsOnInput).toHaveBeenCalled();
    }));
  });

  describe('methodToGetRoutes', () => {
    it('it should call checkUserLogin showProfile will be falsy', () => {
      eventSubject.next(new NavigationEnd(1, '/mens', 'redirectUrl'));
      mockAuthService.checkUserLogin.and.returnValue(true);
      component.methodToGetRoutes();
      expect(component.checkLogin).toBe(true);
      expect(component.showProfile).toBe(true);
    });
    it('should set previousUrl to currentUrl if currentUrl not includes search', () => {
      component.previousUrl = 'test/url/previous';
      component.currentUrl = 'test/url/currentUrl';
      eventSubject.next(new NavigationEnd(1, '/mens', 'redirectUrl'));
      mockAuthService.checkUserLogin.and.returnValue(true);
      component.methodToGetRoutes();
      expect(component.previousUrl).toEqual('test/url/currentUrl');
    });

    it('should not change previousUrl if currentUrl  includes search', () => {
      component.previousUrl = 'test/url/previous';
      component.currentUrl = 'test/url/currentUrl?search=roadstar';
      eventSubject.next(new NavigationEnd(1, '/mens', 'redirectUrl'));
      mockAuthService.checkUserLogin.and.returnValue(true);
      component.methodToGetRoutes();
      expect(component.previousUrl).toEqual('test/url/previous');
    });

    it('should set currentUrl to url emited by router events', () => {
      eventSubject.next(new NavigationEnd(1, '/mens', 'redirectUrl'));
      mockAuthService.checkUserLogin.and.returnValue(true);
      component.methodToGetRoutes();
      expect(component.currentUrl).toEqual('/mens');
    });

    it('should set showProfile to false if url have login or signup routes', () => {
      eventSubject.next(new NavigationEnd(1, '/login', 'redirectUrl'));
      eventSubject.next(new NavigationEnd(1, '/signup', 'redirectUrl'));
      mockAuthService.checkUserLogin.and.returnValue(true);
      component.methodToGetRoutes();
      expect(component.showProfile).toBe(false);
    });
  });
  describe('mousehover', () => {
    it('should set hover to true and stop event propagation', () => {
      const mockEvent = new Event('mouseenter');
      spyOn(mockEvent, 'stopPropagation');

      component.mousehover(mockEvent);

      expect(component.hover).toBe(true);
      expect(mockEvent.stopPropagation).toHaveBeenCalled();
    });

    it('should call getProfileDetails if checkLogin is true and userName is not set', () => {
      const mockEvent = new Event('mouseenter');
      component.checkLogin = true;
      component.userName = '';
      mockProfileService.getProfileDetails.and.returnValue(of(profileDetails));
      component.mousehover(mockEvent);
      expect(mockProfileService.getProfileDetails).toHaveBeenCalled();
      expect(component.userName).toBe('test');
    });

    it('should not call getProfileDetails if checkLogin is false', () => {
      const mockEvent = new Event('mouseenter');
      component.checkLogin = false;
      component.mousehover(mockEvent);
      expect(mockProfileService.getProfileDetails).not.toHaveBeenCalled();
    });

    it('should not call getProfileDetails if userName is already set', () => {
      const mockEvent = new Event('mouseenter');
      component.checkLogin = true;
      component.userName = 'John Doe';
      component.mousehover(mockEvent);
      expect(mockProfileService.getProfileDetails).not.toHaveBeenCalled();
    });
  });

  describe('mouseleave', () => {
    it('should call stoppropagation method and update hover property', () => {
      const mockEvent = new Event('mouseleave');
      spyOn(mockEvent, 'stopPropagation');

      component.mouseleave(mockEvent);

      expect(component.hover).toBe(false);
      expect(mockEvent.stopPropagation).toHaveBeenCalled();
    });
  });

  describe('activeOnHover', () => {
    it('should stop event propagation', () => {
      let element = document.createElement('p');
      const mockEvent = new Event('mouseenter');
      spyOn(mockEvent, 'stopPropagation');

      component.activeOnHover(element, mockEvent);

      expect(mockEvent.stopPropagation).toHaveBeenCalled();
    });
    it('should remove "activeOnHover" class from all searchBrand elements ', () => {
      const mockEvent = new Event('mouseenter');
      let element = document.createElement('p');
      const brandElements = fixture.debugElement.queryAll(
        By.css('.searchBrand')
      ) as any;
      spyOn(component, 'activeOnHover');

      component.activeOnHover(element, mockEvent);

      brandElements.forEach((el: HTMLParagraphElement) => {
        spyOn(el.classList, 'remove');
        expect(el.classList.contains('activeOnHover')).toBeFalsy();
        expect(el.classList.remove).toHaveBeenCalledWith('activeOnHover');
      });

      expect(component.activeOnHover).toHaveBeenCalledWith(element, mockEvent);
    });

    it('should add "activeOnHover" class to selected element ', () => {
      const mockEvent = new Event('mouseenter');
      let element = document.createElement('p') as HTMLParagraphElement;
      spyOn(component, 'activeOnHover').and.callThrough();

      component.activeOnHover(element, mockEvent);
      expect(component.activeOnHover).toHaveBeenCalledWith(element, mockEvent);
      expect(element.classList.contains('activeOnHover')).toBeTrue();
    });
  });

  describe('deactiveOnHover', () => {
    it('should stop event propagation', () => {
      let element = document.createElement('p');
      const mockEvent = new Event('mouseleave');
      spyOn(mockEvent, 'stopPropagation');

      component.activeOnHover(element, mockEvent);

      expect(mockEvent.stopPropagation).toHaveBeenCalled();
    });

    it('should remove "activeOnHover" class from element', fakeAsync(() => {
      let element = document.createElement('p') as HTMLParagraphElement;
      element.classList.add('activeOnHover');
      const mockEvent = new Event('mouseleave');
      spyOn(component, 'deactiveOnHover').and.callThrough();

      component.deactiveOnHover(element, mockEvent);
      tick(1000);
      expect(component.deactiveOnHover).toHaveBeenCalledWith(
        element,
        mockEvent
      );
      expect(element.classList.contains('activeOnHover')).toBeFalsy();
    }));
  });

  describe('searchBrandsOnInput', () => {
    it('should call getBrandsOnSearch on searchValue and change brandsOnSearch and noBrands to false and reset brandsOnSearch after 10 seconds if data length is not 0', fakeAsync(() => {
      let mockSearchValue = 'Roadstar';

      mockHttpService.getBrandsOnSearch.and.returnValue(of(brandsOnsearch));
      component.searchValue = mockSearchValue;
      component.searchBrandsOnInput();
      tick();
      expect(mockHttpService.getBrandsOnSearch).toHaveBeenCalledWith({
        search: mockSearchValue,
      });
      expect(component.brandsOnSearch).toEqual(brandsOnsearch);
      expect(component.noBrands).toBeFalse();
      tick(10000);
      expect(component.brandsOnSearch).toEqual([]);
    }));
    it('should set noBrands to true and reset it after 10 seconds if data length is 0', fakeAsync(() => {
      const mockSearchValue = 'example';
      mockHttpService.getBrandsOnSearch.and.returnValue(of([]));

      component.searchValue = mockSearchValue;
      component.searchBrandsOnInput();
      tick();

      expect(component.noBrands).toBe(true);
      expect(component.brandsOnSearch).toEqual([]);
      tick(10000);

      expect(component.noBrands).toBe(false);
    }));
    it('should do nothing if searchValue is falsy', () => {
      component.searchValue = '';

      component.searchBrandsOnInput();

      expect(mockHttpService.getBrandsOnSearch).not.toHaveBeenCalled();
    });
  });

  describe('searchProductsOnBrand', () => {
    it('should set noBrands to be false and searchValue is empty or undefined on noBrands is false', () => {
      let noBrands = true;
      component.noBrands = noBrands;
      spyOn(mockHttpService.queryParams, 'next');
      component.searchProductsOnBrand();

      expect(component.noBrands).toBeFalse();
      expect(component.searchValue).toEqual('');
      expect(mockHttpService.queryParams.next).not.toHaveBeenCalledWith({});
      expect(mockHttpService.addQueryParametersToRoute).not.toHaveBeenCalled();
    });

    it('should searchVlaue equal to brand if brand is passed as arguement and should call addQueryParametersToRoute', () => {
      component.noBrands = false;
      spyOn(mockHttpService.queryParams, 'next');
      let value = 'roadstar';
      component.searchProductsOnBrand(value);
      expect(mockHttpService.addQueryParametersToRoute).toHaveBeenCalledWith({
        search: value,
      });
      expect(component.searchValue).toEqual('');
      expect(mockHttpService.queryParams.next).toHaveBeenCalledWith({});
    });

    it('should call addQueryParametersToRoute with currentroute if there is no searchValue and doesn"t include search in currentUrl ', () => {
      component.noBrands = false;
      component.currentUrl = 'test?brands=roadstar';
      spyOn(mockHttpService.queryParams, 'next');

      component.searchProductsOnBrand();

      expect(mockHttpService.addQueryParametersToRoute).toHaveBeenCalledWith(
        {
          search: '',
        },
        'test'
      );
      expect(component.searchValue).toEqual('');
      expect(mockHttpService.queryParams.next).toHaveBeenCalledWith({});
    });
    it('should call addQueryParametersToRoute with currentroute if there is no searchValue and include search in currentUrl ', () => {
      component.noBrands = false;
      component.previousUrl = 'mens';
      component.currentUrl = 'test?search=roadstar';
      spyOn(mockHttpService.queryParams, 'next');

      component.searchProductsOnBrand();

      expect(mockHttpService.addQueryParametersToRoute).toHaveBeenCalledWith(
        {
          search: '',
        },
        'mens'
      );
      expect(component.searchValue).toEqual('');
      expect(mockHttpService.queryParams.next).toHaveBeenCalledWith({});
    });
  });

  describe('searchProductsOnEnter', () => {
    it('should check enter event if true and call searchProductsOnBrand', () => {
      let mockEvent = { key: 'Enter' } as KeyboardEvent;
      spyOn(component, 'searchProductsOnBrand');
      component.searchProductsOnEnter(mockEvent);
      expect(component.searchProductsOnBrand).toHaveBeenCalled();
    });
    it('should not call searchProductsOnBrand when a key other than Enter is pressed', () => {
      const mockEvent = { key: 'SomeKey' } as KeyboardEvent;
      spyOn(component, 'searchProductsOnBrand');
      component.searchProductsOnEnter(mockEvent);
      expect(component.searchProductsOnBrand).not.toHaveBeenCalled();
    });

    it('should not call searchProductsOnBrand when the event is undefined', () => {
      spyOn(component, 'searchProductsOnBrand');
      component.searchProductsOnEnter(undefined);
      expect(component.searchProductsOnBrand).not.toHaveBeenCalled();
    });
  });

  describe('ngOnDestroy', () => {
    it('should unsubscribe from cartCount subscription on ngOnDestroy', () => {
      component.cartCount = new Subscriber();
      spyOn(component.cartCount, 'unsubscribe');

      component.ngOnDestroy();

      expect(component.cartCount.unsubscribe).toHaveBeenCalled();
    });
    it('should not throw an error if cartCount is undefined on ngOnDestroy', () => {
      expect(() => component.ngOnDestroy()).not.toThrow();
    });
  });
});
