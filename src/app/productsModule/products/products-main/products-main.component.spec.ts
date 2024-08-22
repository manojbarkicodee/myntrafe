import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ProductsMainComponent } from './products-main.component';
import { RouterTestingModule } from '@angular/router/testing';
import { httpService } from 'src/app/services/products/products.service';
import { WishlistService } from 'src/app/services/wishlist/wishlist.service';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { Subject, Subscriber, of } from 'rxjs';
import { products, wishlistProducts } from 'src/app/testing/mockData';
import { mockProductsData } from 'src/app/testing/productsMockDta';

describe('ProductsMainComponent', () => {
  let component: ProductsMainComponent;
  let fixture: ComponentFixture<ProductsMainComponent>;
  let httpServiceMock: jasmine.SpyObj<httpService>;
  let wishlistServiceMock: jasmine.SpyObj<WishlistService>;
  let authenticationServiceMock: jasmine.SpyObj<AuthenticationService>;
  let routerMock: jasmine.SpyObj<Router>;
  let activatedRouteMock: ActivatedRoute;
  beforeEach(async () => {
    httpServiceMock = jasmine.createSpyObj('httpService', [
      'getProductsbyCategory',
      'scrollToTop',
    ]);
    wishlistServiceMock = jasmine.createSpyObj('WishlistService', [
      'getMethod_ProductsInWishlist',
    ]);
    authenticationServiceMock = jasmine.createSpyObj('AuthenticationService', [
      'checkUserLogin',
    ]);
    routerMock = jasmine.createSpyObj('Router', ['navigate']);
    httpServiceMock.products = new Subject();
    httpServiceMock.queryParams = new Subject();
    await TestBed.configureTestingModule({
      declarations: [ProductsMainComponent],
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [
        { provide: httpService, useValue: httpServiceMock },
        { provide: WishlistService, useValue: wishlistServiceMock },
        { provide: AuthenticationService, useValue: authenticationServiceMock },
        { provide: Router, useValue: routerMock },
        {
          provide: ActivatedRoute,
          useValue: {
            url: of([{ path: 'mockPath' }]),
            params: of({ category: 'testCategory' }),
            queryParams: of({}),
            snapshot: {
              paramMap: convertToParamMap({}), // Use convertToParamMap to simulate paramMap
              queryParams: {},
            },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductsMainComponent);
    component = fixture.componentInstance;
    activatedRouteMock = TestBed.inject(ActivatedRoute);
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should set checkLogin to true and call renderProductsChangeInQueryParams and renderProductsChangeInParams', () => {
      // Arrange
      authenticationServiceMock.checkUserLogin.and.returnValue(true);
      activatedRouteMock.queryParams = of({ brands: ['test1', 'test2'] });
      spyOn(component, 'renderProductsChangeInQueryParams');
      spyOn(component, 'renderProductsChangeInParams');

      // Act
      component.ngOnInit();

      // Assert
      expect(component.checkLogin).toBe(true);
      expect(component.renderProductsChangeInQueryParams).toHaveBeenCalled();
      expect(component.renderProductsChangeInParams).toHaveBeenCalled();
    });

    it('should call products subject and pagination data and totalpage and other properties', () => {
      spyOn(component, 'renderProductsChangeInQueryParams');
      spyOn(component, 'renderProductsChangeInParams');
      let pgationData = mockProductsData.slice(0, 20);
      spyOn(component, 'paginationMethod').and.returnValue(pgationData);
      component.ngOnInit();
      httpServiceMock.products.next(mockProductsData);

      expect(component.paginationData).toEqual(pgationData);
      expect(component.products).toEqual(mockProductsData);
      expect(component.totalPage).toEqual(3);
      expect(component.showPages).toEqual([1, 2, 3]);
    });

    it('should set showNextButton to false if page and totalPage is equal', () => {
      component.page = 3;
      spyOn(component, 'renderProductsChangeInQueryParams');
      spyOn(component, 'renderProductsChangeInParams');
      let pgationData = mockProductsData.slice(0, 20);
      spyOn(component, 'paginationMethod').and.returnValue(pgationData);
      component.ngOnInit();
      httpServiceMock.products.next(mockProductsData);
      expect(component.showNextButton).toBe(false);
    });

    it('should set showNextButton to true if page and totalPage is not equal', () => {
      component.page = 1;
      spyOn(component, 'renderProductsChangeInQueryParams');
      spyOn(component, 'renderProductsChangeInParams');
      let pgationData = mockProductsData.slice(0, 20);
      spyOn(component, 'paginationMethod').and.returnValue(pgationData);
      component.ngOnInit();
      httpServiceMock.products.next(mockProductsData);
      expect(component.showNextButton).toBe(true);
    });

    it('should set noproducts to true if there is no products', () => {
      component.page = 4;
      spyOn(component, 'renderProductsChangeInQueryParams');
      spyOn(component, 'renderProductsChangeInParams');
      spyOn(component, 'paginationMethod').and.returnValue([]);
      component.ngOnInit();
      httpServiceMock.products.next([]);
      expect(component.noProducts).toBe(true);
    });
    it('should set noproducts to false if there is are products', () => {
      component.page = 4;
      spyOn(component, 'renderProductsChangeInQueryParams');
      spyOn(component, 'renderProductsChangeInParams');
      let pgationData = mockProductsData.slice(0, 20);
      spyOn(component, 'paginationMethod').and.returnValue(pgationData);
      component.ngOnInit();
      httpServiceMock.products.next(mockProductsData);
      expect(component.noProducts).toBe(false);
    });
    it('should call scrollToTop', fakeAsync(() => {
      component.page = 4;
      spyOn(component, 'renderProductsChangeInQueryParams');
      spyOn(component, 'renderProductsChangeInParams');

      let pgationData = mockProductsData.slice(0, 20);
      spyOn(component, 'paginationMethod').and.returnValue(pgationData);
      component.ngOnInit();
      tick();

      httpServiceMock.products.next(mockProductsData);
      expect(httpServiceMock.scrollToTop).toHaveBeenCalled();
    }));
  });

  describe('renderProductsChangeInParams', () => {
    it('should subscribe to route params and update category accordingly', () => {
      const mockParams = { category: 'mockCategory' };
      activatedRouteMock.params = of(mockParams);
      activatedRouteMock.snapshot.queryParams = {
        search: 'example',
        brand: 'test1,test2',
      };
      httpServiceMock.getProductsbyCategory.and.returnValue(of([]));
      component.renderProductsChangeInParams();

      expect(component.category).toEqual('mockCategory');
      expect(httpServiceMock.getProductsbyCategory).toHaveBeenCalledOnceWith(
        '/products',
        { search: 'example', brand: 'test1,test2' }
      );
    });
    it('should set endpoint to "/products/category" when no search query parameter is present', () => {
      const mockParams = { category: 'mockCategory' };
      activatedRouteMock.params = of(mockParams);
      activatedRouteMock.snapshot.queryParams = { brand: 'test1,test2' };
      httpServiceMock.getProductsbyCategory.and.returnValue(of([]));
      component.renderProductsChangeInParams();
      expect(component.category).toEqual('mockCategory');
      expect(httpServiceMock.getProductsbyCategory).toHaveBeenCalledOnceWith(
        '/products/mockCategory',
        { brand: 'test1,test2' }
      );
    });


  it('should convert queryParams values to arrays excluding "sort"', () => {
    
    const mockParams = { category: 'mockCategory' };
    activatedRouteMock.params = of(mockParams);
    activatedRouteMock.snapshot.queryParams = { brand: 'test1,test2' };
    httpServiceMock.getProductsbyCategory.and.returnValue(of([]));
    component.renderProductsChangeInParams();

    expect(component.queryParams).toEqual({brand:['test1','test2'] });
  });
  it('should call next on httpservice.queryParams and update products', fakeAsync(() => {
  
    
    spyOn(httpServiceMock.queryParams, 'next');
    spyOn(httpServiceMock.products,'next')
    const mockParams = { category: 'mockCategory' };
    activatedRouteMock.params = of(mockParams);
    activatedRouteMock.snapshot.queryParams = { brand: 'test1,test2' };
    httpServiceMock.getProductsbyCategory.and.returnValue(of([]));
    component.renderProductsChangeInParams();
  
    component.renderProductsChangeInParams();
    tick();

    expect(httpServiceMock.queryParams.next).toHaveBeenCalledWith({brand:['test1','test2']});
    expect(httpServiceMock.products.next).toHaveBeenCalledWith([]);
  }));
  });

  describe('renderProductsChangeInQueryParams', () => {
    it('should call getProductsbyCategory with correct endpoint when queryParams have category', () => {
      activatedRouteMock.queryParams = of({ brands: ['test1', 'test2'] });
      spyOn(activatedRouteMock.queryParams, 'subscribe').and.callThrough();
      component.category = 'mens';
      httpServiceMock.getProductsbyCategory.and.returnValue(of([]));

      component.renderProductsChangeInQueryParams();

      expect(activatedRouteMock.queryParams.subscribe).toHaveBeenCalled();
      expect(httpServiceMock.getProductsbyCategory).toHaveBeenCalledWith(
        `/products/${component.category}`,
        { brands: ['test1', 'test2'] }
      );
    });

    it('should call getProductsbyCategory with correct endpoint when queryParams have search', () => {
      activatedRouteMock.queryParams = of({ search: 'example' });

      spyOn(activatedRouteMock.queryParams, 'subscribe').and.callThrough();
      httpServiceMock.getProductsbyCategory.and.returnValue(of([]));

      component.renderProductsChangeInQueryParams();

      expect(activatedRouteMock.queryParams.subscribe).toHaveBeenCalled();
      expect(httpServiceMock.getProductsbyCategory).toHaveBeenCalledWith(
        '/products',
        { search: 'example' }
      );
    });
    it('should not call getProductsbyCategory when queryParams are empty', () => {
      activatedRouteMock.queryParams = of({});

      spyOn(activatedRouteMock.queryParams, 'subscribe').and.callThrough();
      httpServiceMock.getProductsbyCategory.and.returnValue(of([]));

      component.renderProductsChangeInQueryParams();

      expect(activatedRouteMock.queryParams.subscribe).toHaveBeenCalled();
      expect(httpServiceMock.getProductsbyCategory).not.toHaveBeenCalled();
    });

    it('should emit next event with products subject', () => {
      activatedRouteMock.queryParams = of({ search: 'example' });
      spyOn(httpServiceMock.products, 'next');
      spyOn(activatedRouteMock.queryParams, 'subscribe').and.callThrough();
      httpServiceMock.getProductsbyCategory.and.returnValue(of([]));

      component.renderProductsChangeInQueryParams();

      expect(httpServiceMock.products.next).toHaveBeenCalledWith([]);
    });
  });

  describe('redirectToPageMethod', () => {
    it('should set showPrevButton to false when page is 1', () => {
      component.totalPage = 3;
      component.products = mockProductsData;

      component.redirectToPageMethod(1);

      expect(component.showPrevButton).toBe(false);
    });

    it('should set showPrevButton to true when page is greater than 1', () => {
      component.totalPage = 3;
      component.products = mockProductsData;

      component.redirectToPageMethod(2);

      expect(component.showPrevButton).toBe(true);
    });

    it('should set showNextButton to false when page is equal to totalPage', () => {
      component.totalPage = 3;
      component.products = mockProductsData;

      component.redirectToPageMethod(3);

      expect(component.showNextButton).toBe(false);
    });

    it('should set showNextButton to true when page is less than totalPage', () => {
      component.totalPage = 3;
      component.products = mockProductsData;

      component.redirectToPageMethod(2);

      expect(component.showNextButton).toBe(true);
    });

    it('should call paginationMethod with the correct page number', () => {
      spyOn(component, 'paginationMethod');
      component.products = mockProductsData;

      component.redirectToPageMethod(3);

      expect(component.paginationMethod).toHaveBeenCalledWith(3);
    });
  });

  describe('redirectToNextPage', () => {
    it('should decrease the page by 1', () => {
      component.products = mockProductsData;
      component.page = 3;

      component.redirectToPreviousPage();

      expect(component.page).toBe(2);
    });

    it('should set showNextButton to true when page is less than totalPage', () => {
      component.page = 3;
      component.totalPage = 5;
      component.products = mockProductsData;
      component.redirectToPreviousPage();

      expect(component.showNextButton).toBe(true);
    });

    it('should set showPrevButton to false when page is less than or equal to 1', () => {
      component.page = 1;
      component.totalPage = 5;
      component.products = mockProductsData;
      component.redirectToPreviousPage();

      expect(component.showPrevButton).toBe(false);
    });

    it('should call paginationMethod with the correct page number', () => {
      spyOn(component, 'paginationMethod');
      component.products = mockProductsData;
      component.redirectToPreviousPage();

      expect(component.paginationMethod).toHaveBeenCalledWith(component.page);
    });
  });

  describe('activeWishlistedProduct', () => {
    it('should set wishlisted property to true for matching products', async () => {
      const mockWishlistProducts = [
        {
          products: wishlistProducts,
        },
      ];

      for (let i = 0; i < mockProductsData.length; i++) {
        mockProductsData[i].wishlisted = false;
      }
      component.products = mockProductsData;

      wishlistServiceMock.getMethod_ProductsInWishlist.and.returnValue(
        of(mockWishlistProducts)
      );

      await component.activeWishlistedProduct();

      expect(component.products[0].wishlisted).toBe(true);
      expect(component.products[1].wishlisted).toBe(true);
    });

    it('should not set wishlisted property for non-matching products', () => {
      const mockWishlistProducts = [
        {
          products: wishlistProducts,
        },
      ];

      for (let i = 0; i < mockProductsData.length; i++) {
        mockProductsData[i].wishlisted = false;
      }
      component.products = mockProductsData;

      wishlistServiceMock.getMethod_ProductsInWishlist.and.returnValue(
        of(mockWishlistProducts)
      );
      component.activeWishlistedProduct();

      expect(component.products[3].wishlisted).toBe(false);
      expect(component.products[4].wishlisted).toBe(false);
    });
  });

  describe('paginationMethod', () => {
    it('should return the correct pagination data for the first page', () => {
      component.products = mockProductsData;

      const result = component.paginationMethod(1);

      expect(result).toEqual(mockProductsData.slice(0, 20));
    });

    it('should return the correct pagination data for a non-first page', () => {
      component.products = mockProductsData;

      const result = component.paginationMethod(2);

      expect(result).toEqual(mockProductsData.slice(20, 40));
    });

    it('should return an empty array for an invalid page', () => {
      component.products = mockProductsData;

      const result = component.paginationMethod(0);
      expect(result).toEqual([]);
    });

    it('should scroll to top when called', () => {
      component.products = mockProductsData;

      component.paginationMethod(1);

      expect(httpServiceMock.scrollToTop).toHaveBeenCalled();
    });
  });

  describe('navigateToNextRoute', () => {
    it('should navigate to the next route with the correct parameters', fakeAsync(() => {
      // Arrange
      const mockId = 123;
      const mockCategory = 'testCategory';

      // Act
      component.navigateToNextRoute(mockId, mockCategory);
      tick();

      // Assert
      expect(routerMock.navigate).toHaveBeenCalledWith([
        '/products',
        mockCategory,
        mockId,
      ]);
    }));
  });

  describe('setNoproducts', () => {
    it('should set noProducts to true when paginationData is empty', () => {
      // Arrange
      component.paginationData = [];

      // Act
      component.setNoproducts();

      // Assert
      expect(component.noProducts).toBe(true);
    });

    it('should set noProducts to false when paginationData is not empty', () => {
      component.paginationData = mockProductsData;

      component.setNoproducts();

      expect(component.noProducts).toBe(false);
    });
  });
  describe('ngOnDestroy', () => {
    it('should unsubscribe from productsSubscription in ngOnDestroy', fakeAsync(() => {
      component.productsSubscription = new Subscriber();
      spyOn(component.productsSubscription, 'unsubscribe').and.callThrough();

      fixture.destroy();
      tick();

      expect(component.productsSubscription.unsubscribe).toHaveBeenCalled();
    }));
  });
});
