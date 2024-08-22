import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import {
  BottomSheetOverviewExampleSheet,
  ProductComponent,
} from './product.component';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';
import { SharedModule } from 'src/app/shared/shared.module';
import { ProductsHeaderComponent } from './products-header/products-header.component';
import { ProductsSidebarComponent } from './products-sidebar/products-sidebar.component';
import { ProductsMainComponent } from './products-main/products-main.component';
import {
  MAT_BOTTOM_SHEET_DATA,
  MatBottomSheet,
  MatBottomSheetModule,
  MatBottomSheetRef,
} from '@angular/material/bottom-sheet';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { httpService } from 'src/app/services/products/products.service';

describe('ProductComponent', () => {
  let component: ProductComponent;
  let fixture: ComponentFixture<ProductComponent>;
  let routeMock: any;
  let bottomSheetMock: any;
  class MockBottomSheetRef {
    // You can add necessary mock properties and methods here
    // For example, afterDismissed: Observable
  }
  class MockBottomSheet {
    open() {
      return {
        afterDismissed: of(true),
      };
    }
  }
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        ProductComponent,
        ProductsHeaderComponent,
        ProductsSidebarComponent,
        ProductsMainComponent,
      ],
      imports: [HttpClientTestingModule, SharedModule, MatBottomSheetModule],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({}),
            queryParams: of({}),
            snapshot: {
              paramMap: convertToParamMap({}), // Use convertToParamMap to simulate paramMap
              queryParams: { brand: 'roadstar,highlander' },
            },
          },
        },
        { provide: MatBottomSheet, useClass: MockBottomSheet },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductComponent);
    routeMock = TestBed.inject(ActivatedRoute);
    bottomSheetMock = TestBed.inject(MatBottomSheet);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should call on params change and set queryParams', () => {
      routeMock.params = of({ category: 'mens' });
      component.ngOnInit();
      expect(component.queryParams).toEqual({
        brand: ['roadstar', 'highlander'],
      });
    });

    it('should call on params change and set queryParams but not split sort value', () => {
      routeMock.params = of({ category: 'mens' });
      routeMock.snapshot.queryParams = {
        brand: 'roadstar,highlander',
        sort: 'recomended',
      };
      component.ngOnInit();
      expect(component.queryParams).toEqual({
        brand: ['roadstar', 'highlander'],
        sort: 'recomended',
      });
    });

    it('should call on queryParams change and set queryParams on search', () => {
      routeMock.queryParams = of({
        brand: 'roadstar,highlander',
        sort: 'recomended',
        search: 'roadstar',
      });
      component.ngOnInit();
      expect(component.queryParams).toEqual({
        brand: ['roadstar', 'highlander'],
        sort: 'recomended',
        search: ['roadstar'],
      });
    });
  });

  describe('ClickOnFilter', () => {
    it('should set enableFilter to false if it is true', () => {
      component.enableFilter = false;
      component.ClickOnFilter();
      expect(component.enableFilter).toBe(true);
    });
    it('should set enableFilter to true if it is false', () => {
      component.enableFilter = true;
      component.ClickOnFilter();
      expect(component.enableFilter).toBe(false);
    });
  });

  describe('sort', () => {
    it('should call openBottomSheet', () => {
      spyOn(component, 'openBottomSheet');
      component.sort();
      expect(component.openBottomSheet).toHaveBeenCalled();
    });
  });
  describe('applyFilter', () => {
    it('should set filterApply to true and set enableFilter to false', fakeAsync(() => {
      component.applyFilter();
      tick(500);
      expect(component.filterApply).toBe(true);
      expect(component.enableFilter).toBe(false);
    }));
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

  describe('openBottomSheet', () => {
    it('should open the bottom sheet with correct data', () => {
      spyOn(bottomSheetMock, 'open').and.callThrough();

      component.openBottomSheet();

      expect(bottomSheetMock.open).toHaveBeenCalledWith(
        BottomSheetOverviewExampleSheet,
        {
          data: { queryParams: component.queryParams },
        }
      );
    });
  });

  describe('onResize', () => {
    it('should call checkScreenWidth on window resize', () => {
      spyOn(component, 'checkScreenWidth');

      window.dispatchEvent(new Event('resize'));

      expect(component.checkScreenWidth).toHaveBeenCalled();
    });
  });
});

describe('BottomSheetOverviewExampleSheet', () => {
  let component: BottomSheetOverviewExampleSheet;
  let fixture: ComponentFixture<BottomSheetOverviewExampleSheet>;
  let mockBottomSheetRef: jasmine.SpyObj<MatBottomSheetRef>;
  let routeMock: any;
  let httpServiceMock: jasmine.SpyObj<httpService>;
  beforeEach(() => {
    mockBottomSheetRef = jasmine.createSpyObj('MatBottomSheetRef', ['dismiss']);
    httpServiceMock = jasmine.createSpyObj('httpService', [
      'addQueryParametersToRoute',
    ]);
    TestBed.configureTestingModule({
      imports: [
        MatBottomSheetModule,
        BrowserAnimationsModule,
        HttpClientTestingModule,
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({}),
            queryParams: of({}),
            snapshot: {
              paramMap: convertToParamMap({}), // Use convertToParamMap to simulate paramMap
              queryParams: { brand: 'roadstar,highlander' },
            },
          },
        },
        { provide: MAT_BOTTOM_SHEET_DATA, useValue: { queryParams: {} } },
        { provide: MatBottomSheetRef, useValue: mockBottomSheetRef },
        { provide: httpService, useValue: httpServiceMock },
      ],
    });

    fixture = TestBed.createComponent(BottomSheetOverviewExampleSheet);
    routeMock = TestBed.inject(ActivatedRoute);
    component = fixture.componentInstance;
    component.queryParams = {
      sort: 'Recommended',
      brand: ['roadstar', 'highlander'],
    };
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should set sorting values on initialization an should call setSortingValuesOnReaload', () => {
      spyOn(component, 'setSortingValuesOnReaload');
      component.ngOnInit();

      expect(component.sortingValues).toEqual([
        'Recommended',
        'Better Discount',
        'Price:Low to High',
        'Price:High to Low',
        'Customer Rating',
      ]);
      expect(component.setSortingValuesOnReaload).toHaveBeenCalled();
    });
  });

  describe('setSortingValuesOnReaload', () => {
    it('should set sorting values on reload based on queryParams.sort', () => {
      component.queryParams.sort = 'price:asc';
      component.setSortingValuesOnReaload();
      expect(component.selectOption).toEqual('Price:Low to High');

      component.queryParams.sort = 'price:desc';
      component.setSortingValuesOnReaload();
      expect(component.selectOption).toEqual('Price:High to Low');

      component.queryParams.sort = 'discountInpercentage:desc';
      component.setSortingValuesOnReaload();
      expect(component.selectOption).toEqual('Better Discount');

      component.queryParams.sort = 'ratings:desc';
      component.setSortingValuesOnReaload();
      expect(component.selectOption).toEqual('Customer Rating');
    });
  });

  describe('openLink', () => {
    it('should dismiss bottom sheet on openLink', () => {
      component.openLink(new MouseEvent('click'));
      expect(mockBottomSheetRef.dismiss).toHaveBeenCalled();
    });
  });

  describe('selectOptionsMethod', () => {
    it('should dismiss bottom sheet on selectOptionsMethod', () => {
      component.selectOptionsMethod('Recommended');
      expect(mockBottomSheetRef.dismiss).toHaveBeenCalled();
    });

    it('should update selectOption and queryParams.sort on selectOptionsMethod', () => {
      component.selectOptionsMethod('Price:Low to High');
      expect(component.selectOption).toEqual('Price:Low to High');
      expect(component.queryParams.sort).toEqual('price:asc');
    });

    it('should render sorting values in the template', () => {
      fixture.detectChanges();
      const sortingOptions = fixture.debugElement.queryAll(By.css('.options'));
      expect(sortingOptions.length).toEqual(5);

      sortingOptions.forEach((option, index) => {
        expect(option.nativeElement.textContent.trim()).toEqual(
          component.sortingValues[index]
        );
      });
    });

    it('should call addQueryParametersToRoute', () => {
      component.selectOptionsMethod('Price:Low to High');
      expect(httpServiceMock.addQueryParametersToRoute).toHaveBeenCalledWith({
        sort: 'price:asc',
        brand: 'roadstar,highlander',
      });
    });
  });
});
