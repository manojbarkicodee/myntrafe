import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ProductsHeaderComponent } from './products-header.component';
import { ActivatedRoute } from '@angular/router';
import { httpService } from 'src/app/services/products/products.service';
import { Subject, Subscriber, of } from 'rxjs';
import {
  products,
  queryParamsOnfilterData,
  valueToRemove,
} from 'src/app/testing/mockData';


describe('ProductsHeaderComponent', () => {
  let component: ProductsHeaderComponent;
  let fixture: ComponentFixture<ProductsHeaderComponent>;
  let activatedRoute: ActivatedRoute;
  let productsService: jasmine.SpyObj<httpService>;
  beforeEach(async () => {
    productsService = jasmine.createSpyObj('httpService', [
      'products',
      'addQueryParametersToRoute',
      'deleteFilterChip',
    ]);
    productsService.queryParams = new Subject();

    productsService.deleteFilterChip = new Subject();
    productsService.products = new Subject();

    await TestBed.configureTestingModule({
      declarations: [ProductsHeaderComponent],
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            url: of([{ path: 'mockPath' }]),
            params: of({ category: 'testCategory' }),
          },
        },
        {
          provide: httpService,
          useValue: productsService,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductsHeaderComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should set sortingValues and call setSortingValuesOnReaload and setProductsCountOnFilter and setCurrentProductPageOnParamsChange', () => {
      let sortingValues = [
        'Recommended',
        'Better Discount',
        'Price:Low to High',
        'Price:High to Low',
        'Customer Rating',
      ];
      spyOn(component, 'setSortingValuesOnReaload');
      spyOn(component, 'setProductsCountOnFilter');
      spyOn(component, 'setCurrentProductPageOnParamsChange');
      spyOn(component, 'addFilterChipsOnEachFilterChange');
      component.ngOnInit();
      expect(component.sortingValues).toEqual(sortingValues);
      expect(component.setSortingValuesOnReaload).toHaveBeenCalled();
      expect(component.setProductsCountOnFilter).toHaveBeenCalled();
      expect(component.setCurrentProductPageOnParamsChange).toHaveBeenCalled();
      expect(component.addFilterChipsOnEachFilterChange).toHaveBeenCalled();
    });

    it('should not call addFilterChipsOnEachFilterChange on mobileView is true', () => {
      component.mobileView = true;
      spyOn(component, 'addFilterChipsOnEachFilterChange');
      expect(component.addFilterChipsOnEachFilterChange).not.toHaveBeenCalled();
    });
  });

  describe('setSortingValuesOnReaload', () => {
    it('should setselectOption to Better Discount for sort discountInpercentage:desc', () => {
      component.queryParams = {
        sort: 'discountInpercentage:desc',
      };
      component.setSortingValuesOnReaload();
      expect(component.selectOption).toBe('Better Discount');
    });

    it('should setselectOption to  Price:Low to High for  sort  price:asc', () => {
      component.queryParams = {
        sort: 'price:asc',
      };
      component.setSortingValuesOnReaload();
      expect(component.selectOption).toBe('Price:Low to High');
    });

    it('should setselectOption to  Price:Low to High for  sort  price:desc', () => {
      component.queryParams = {
        sort: 'price:desc',
      };
      component.setSortingValuesOnReaload();
      expect(component.selectOption).toBe('Price:High to Low');
    });

    it('should setselectOption to  Customer Rating for  sort  ratings', () => {
      component.queryParams = {
        sort: 'ratings',
      };
      component.setSortingValuesOnReaload();
      expect(component.selectOption).toBe('Customer Rating');
    });
    it('should setselectOption to Recommended for no sort ', () => {
      component.queryParams = {};
      component.setSortingValuesOnReaload();
      expect(component.selectOption).toBe('Recommended');
    });
  });
  describe('addFilterChipsOnEachFilterChange', () => {
    it('should call subscribe on addFilterChipsOnEachFilterChange', () => {
      spyOn(productsService.queryParams, 'subscribe');
      component.addFilterChipsOnEachFilterChange();
      expect(productsService.queryParams.subscribe).toHaveBeenCalled();
    });
    it('should call queryParams and set filteringChips', fakeAsync(() => {
      let formatedData = {
        brand: [
          {
            value: 'Roadster',
            displayValue: 'Roadster',
            name: 'brand',
          },
          {
            value: 'The Indian Garage Co',
            displayValue: 'The Indian Garage Co',
            name: 'brand',
          },
          {
            value: 'Campus Sutra',
            displayValue: 'Campus Sutra',
            name: 'brand',
          },
          {
            value: 'HIGHLANDER',
            displayValue: 'HIGHLANDER',
            name: 'brand',
          },
          {
            value: 'LOCOMOTIVE',
            displayValue: 'LOCOMOTIVE',
            name: 'brand',
          },
        ],
      };
      spyOn(component, 'formatingFilterChips').and.returnValue(formatedData);
      component.addFilterChipsOnEachFilterChange();
      tick();
      productsService.queryParams.next(queryParamsOnfilterData);
      expect(component.formatingFilterChips).toHaveBeenCalledWith(
        queryParamsOnfilterData
      );
      expect(component.filteringChips).toEqual([...formatedData['brand']]);
    }));
  });

  describe('formatingFilterChips', () => {
    it('should format delete sort from chipsObject', () => {
      let formattedChipsObject = component.formatingFilterChips(
        queryParamsOnfilterData
      );
      expect(formattedChipsObject.sort).toBeUndefined();
      expect(formattedChipsObject.search).toBeUndefined();
      expect(formattedChipsObject.brand).toEqual([
        { value: 'Roadster', displayValue: 'Roadster', name: 'brand' },
        {
          value: 'The Indian Garage Co',
          displayValue: 'The Indian Garage Co',
          name: 'brand',
        },
      ]);

      expect(formattedChipsObject.price).toEqual([
        { value: '10:20', displayValue: 'Rs.10 to Rs.20', name: 'price' },
        { value: '30:40', displayValue: 'Rs.30 to Rs.40', name: 'price' },
      ]);

      expect(formattedChipsObject.discount).toEqual([
        { value: '5:10', displayValue: '5% to 10%', name: 'discount' },
        { value: '15:20', displayValue: '15% to 20%', name: 'discount' },
      ]);
    });
    it('should handle empty chipsObject', () => {
      const chipsObject = {};

      const formattedChipsObject = component.formatingFilterChips(chipsObject);

      expect(formattedChipsObject).toEqual({});
    });
  });

  describe('setProductsCountOnFilter', () => {
    it('should call products and set productsCount', () => {
      component.setProductsCountOnFilter();
      productsService.products.next(products);

      expect(component.productsCount).toEqual(2);
    });
  });

  describe('setCurrentProductPageOnParamsChange', () => {
    it('should call params and set category', async () => {
      activatedRoute.params = of({ category: 'test' });
      await component.setCurrentProductPageOnParamsChange();
      expect(component.category).toEqual('test');
    });
  });

  describe('mousehover', () => {
    it('should set showSelectOptions to true', () => {
      component.mousehover();
      expect(component.showSelectOptions).toBe(true);
    });
  });

  describe('mouseleave', () => {
    it('should set showSelectOptions to true', () => {
      component.mouseleave();
      expect(component.showSelectOptions).toBe(false);
    });
  });

  describe('removeChip', () => {
    it('should remove the chip from filteringChips array', () => {
      component.filteringChips = [valueToRemove];

      component.removeChip(valueToRemove);

      expect(component.filteringChips).not.toContain(valueToRemove);
    });

    it('should remove the value from queryParams', () => {
      component.queryParams = { brand: ['Roadster', 'OtherBrand'] };

      component.removeChip(valueToRemove);

      expect(component.queryParams.brand).not.toContain(valueToRemove.value);
    });

    it('should delete the key from queryParams if the array becomes empty', () => {
      component.queryParams = { brand: ['Roadster'] };

      component.removeChip(valueToRemove);

      expect(component.queryParams.brand).toBeUndefined();
    });

    it('should update queryParams and call addQueryParametersToRoute', () => {
      component.queryParams = { brand: ['Roadster', 'OtherBrand'] };

      component.removeChip(valueToRemove);

      expect(productsService.addQueryParametersToRoute).toHaveBeenCalledWith({
        brand: 'OtherBrand',
      });
    });

    it('should delete the chip from filteringChips array', () => {
      component.filteringChips = [valueToRemove];

      component.removeChip(valueToRemove);

      expect(component.filteringChips).not.toContain(valueToRemove);
    });

    it('should emit value to deleteFilterChip subject', () => {
      spyOn(productsService.deleteFilterChip, 'next');

      component.removeChip(valueToRemove);

      expect(productsService.deleteFilterChip.next).toHaveBeenCalledWith(
        valueToRemove.value
      );
    });

    describe('selectOptionsMethod', () => {
      it('should set selectOption to the provided value', () => {
        const testValue = 'Price:Low to High';
        component.queryParams = { sort: undefined };
        component.selectOptionsMethod(testValue);
        expect(component.selectOption).toBe(testValue);
      });

      it('should set queryParams.sort to "undefined" if it is "undefined"', () => {
        component.queryParams = { sort: undefined };
        const testValue = 'Recommended';
        component.selectOptionsMethod(testValue);
        expect(component.queryParams.sort).toBeUndefined();
      });

      it('should delete queryParams.sort for "Recommended"', () => {
        component.queryParams = { sort: 'someSortValue' };
        const testValue = 'Recommended';
        component.selectOptionsMethod(testValue);
        expect(component.queryParams.sort).toBeUndefined();
      });

      it('should set queryParams.sort to "price:asc" for "Price:Low to High"', () => {
        const testValue = 'Price:Low to High';
        component.queryParams = { sort: undefined };
        component.selectOptionsMethod(testValue);
        expect(component.queryParams.sort).toBe('price:asc');
      });

      it('should set queryParams.sort to "price:desc" for "Price:High to Low"', () => {
        const testValue = 'Price:High to Low';
        component.queryParams = { sort: undefined };
        component.selectOptionsMethod(testValue);
        expect(component.queryParams.sort).toBe('price:desc');
      });

      it('should set queryParams.sort to "discountInpercentage:desc" for "Better Discount"', () => {
        const testValue = 'Better Discount';
        component.queryParams = { sort: undefined };
        component.selectOptionsMethod(testValue);
        expect(component.queryParams.sort).toBe('discountInpercentage:desc');
      });

      it('should set queryParams.sort to "ratings:desc" for "Customer Rating"', () => {
        const testValue = 'Customer Rating';
        component.queryParams = { sort: undefined };
        component.selectOptionsMethod(testValue);
        expect(component.queryParams.sort).toBe('ratings:desc');
      });

      it('should join queryParams values if the key is not "sort"', () => {
        const testValue = 'Some Value';
        component.queryParams = {
          brand: ['value1', 'value2'],
          price: ['value3', 'value4'],
        };
        component.selectOptionsMethod(testValue);

        expect(component.queryParams.brand).toEqual(['value1', 'value2']);
        expect(component.queryParams.price).toEqual(['value3', 'value4']);
      });

      it('should call addQueryParametersToRoute with the updated queryParams', () => {
        component.queryParams = { sort: undefined };
        const testValue = 'Some Value';
        component.selectOptionsMethod(testValue);
        expect(productsService.addQueryParametersToRoute).toHaveBeenCalledWith(
          component.queryParams
        );
      });
    });

    describe('', () => {
      it('should unsubscribe from productsSubscription if defined on ngOnDestroy', () => {
        component.productsSubscription = new Subscriber();

        spyOn(component.productsSubscription, 'unsubscribe');

        component.ngOnDestroy();

        expect(component.productsSubscription.unsubscribe).toHaveBeenCalled();
      });

      it('should not throw an error if productsSubscription is undefined on ngOnDestroy', () => {
        expect(() => component.ngOnDestroy()).not.toThrow();
      });

      it('should unsubscribe from queryParamsSubscription if defined on ngOnDestroy', () => {
        component.queryParamsSubscription = new Subscriber();

        spyOn(component.queryParamsSubscription, 'unsubscribe');

        component.ngOnDestroy();

        expect(
          component.queryParamsSubscription.unsubscribe
        ).toHaveBeenCalled();
      });

      it('should not throw an error if queryParamsSubscription is undefined on ngOnDestroy', () => {
        expect(() => component.ngOnDestroy()).not.toThrow();
      });
    });
  });
});
