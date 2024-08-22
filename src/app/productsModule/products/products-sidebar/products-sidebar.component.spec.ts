import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ProductsSidebarComponent } from './products-sidebar.component';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { Subject, of } from 'rxjs';
import { httpService } from 'src/app/services/products/products.service';
import { discountfilterList, pricefilterList } from './static.data';
import { brandsOnsearch, colors } from 'src/app/testing/mockData';
import { QueryList } from '@angular/core';
import { MatCheckbox } from '@angular/material/checkbox';
import { SharedModule } from 'src/app/shared/shared.module';
import { colorsSchema } from '../../model';
import { ExternalExpr } from '@angular/compiler';

describe('ProductsSidebarComponent', () => {
  let component: ProductsSidebarComponent;
  let fixture: ComponentFixture<ProductsSidebarComponent>;
  let activatedRouteMock: ActivatedRoute;
  let httpServiceMock: jasmine.SpyObj<httpService>;
  let routerMock: jasmine.SpyObj<Router>;
  beforeEach(async () => {
    httpServiceMock = jasmine.createSpyObj('httpService', [
      'getBrandsMethod',
      'getColorsMethod',
      'getColorsMethod',
      'getProductsbyCategory',
      'addQueryParametersToRoute',
    ]);
    httpServiceMock.deleteFilterChip = new Subject();
    httpServiceMock.queryParams = new Subject();
    routerMock = jasmine.createSpyObj('Router', ['navigate']);
    await TestBed.configureTestingModule({
      declarations: [ProductsSidebarComponent],
      imports: [HttpClientTestingModule, RouterTestingModule, SharedModule],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({}),
            queryParams: of({}),
            snapshot: {
              paramMap: convertToParamMap({}),
              queryParams: {},
            },
          },
        },
        { provide: httpService, useValue: httpServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductsSidebarComponent);
    activatedRouteMock = TestBed.inject(ActivatedRoute);
    const mockColors = [
      { primaryColour: 'Color1' },
      { primaryColour: 'Color2' },
    ];
    // httpServiceMock.getBrandsMethod.and.returnValue(of(brandsOnsearch));
    // httpServiceMock.getColorsMethod.and.returnValue(of(mockColors));

    component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onWindowScroll', () => {
    it('should set toFixed to true when scroll position is greater than or equal to 720', fakeAsync(() => {
      spyOnProperty(window, 'pageYOffset', 'get').and.returnValue(721);

      component.onWindowScroll();
      tick();

      expect(component.toFixed).toBe(true);
    }));

    it('should set toFixed to false when scroll position is less than 720', fakeAsync(() => {
      spyOnProperty(window, 'pageYOffset', 'get').and.returnValue(719);

      component.onWindowScroll();
      tick();

      expect(component.toFixed).toBe(false);
    }));
  });

  describe('ngOnInit', () => {
    it('should initialize pricelist and discountlist, and call relevant methods', () => {
      const mockBrands = [{ name: 'Brand1' }, { name: 'Brand2' }];
      const mockColors = [
        { primaryColour: 'Color1' },
        { primaryColour: 'Color2' },
      ];

      spyOn(component, 'checkFiltersOnDeleteChips');
      spyOn(component, 'renderBrandsAndColorsChangeInParams');
      spyOn(component, 'renderBrandsAndColorsOnSearch');

      component.ngOnInit();

      expect(component.pricelist).toEqual(pricefilterList);
      expect(component.discountlist).toEqual(discountfilterList);

      expect(component.checkFiltersOnDeleteChips).toHaveBeenCalled();
      expect(component.renderBrandsAndColorsChangeInParams).toHaveBeenCalled();
      expect(component.renderBrandsAndColorsOnSearch).toHaveBeenCalled();

      expect(component).toBeTruthy();
    });
  });

  describe('ngAfterViewInit', () => {
    it('should check checkboxes based on queryParams and set default filters for mobile view', (done) => {
      fixture.detectChanges();
      spyOn(component, 'setDefaultFilters');

      component.isMobileView = true;

      const mockQueryParams: any = {
        brand: ['Roadstar'],
        color: ['Color1'],
        price: ['100'],
        discount: ['10'],
      };

      component.queryParams = mockQueryParams;

      fixture.detectChanges();

      setTimeout(() => {
        fixture.detectChanges();

        component.checkBox.toArray().forEach((el) => {
          for (let key in mockQueryParams) {
            if (el.name === key && mockQueryParams[key].includes(el.value)) {
              expect(el.checked).toBeTrue();
            }
          }
        });

        if (component.isMobileView) {
          expect(component.setDefaultFilters).toHaveBeenCalledWith(
            'brand',
            component.brands,
            'name'
          );
          expect(component.setDefaultFilters).toHaveBeenCalledWith(
            'color',
            component.colors,
            'primaryColour'
          );
          expect(component.setDefaultFilters).toHaveBeenCalledWith(
            'price',
            component.pricelist,
            'value'
          );
          expect(component.setDefaultFilters).toHaveBeenCalledWith(
            'discount',
            component.discountlist,
            'value'
          );

          expect(component).toBeTruthy();

          done();
        }
      }, 200);
    });
  });

  describe('checkFiltersOnDeleteChips', () => {
    it('should uncheck checkbox based on deleteFilterChip event', () => {
      fixture.detectChanges();
      const checkboxValue = 'Roadstar';

      component.checkFiltersOnDeleteChips();
      httpServiceMock.deleteFilterChip.next(checkboxValue);

      expect(component.checkBox.toArray()[0].checked).toBeFalse();
    });
  });

  describe('renderBrandsAndColorsOnSearch', () => {
    it('should handle search query parameter without colors', fakeAsync(() => {
      activatedRouteMock.queryParams = of({ search: 'roadstar' });
      component.pricelist = pricefilterList;
      let mockColors: colorsSchema[] = colors;
      mockColors = mockColors.map((el) => {
        el['checked'] = false;
        return { ...el };
      });
      httpServiceMock.getColorsMethod.and.returnValue(of(colors));
      component.renderBrandsAndColorsOnSearch();
      tick();
      component.colors.forEach((el, i) => {
        expect(el.checked).toEqual(mockColors[i].checked);
      });
      expect(component.active).toEqual('price');
      expect(component.filterItems).toEqual(component.pricelist);
    }));

    it('should handle search query parameter with multiple colors', () => {
      const queryParamsMock = {
        search: 'roadstar',
        color: 'Black,Blue,Navy Blue',
      };
      let colorsMock: colorsSchema[] = colors;
      colorsMock = colorsMock.map((el, i) => {
        if (i >= 0 && i < 3) {
          el['checked'] = true;
        } else {
          el['checked'] = false;
        }
        return { ...el };
      });
      activatedRouteMock.queryParams = of(queryParamsMock);
      httpServiceMock.getColorsMethod.and.returnValue(of(colors));

      component.renderBrandsAndColorsOnSearch();

      component.colors.forEach((el, i) => {
        expect(el.checked).toEqual(colorsMock[i].checked);
      });
      expect(component.brands).toEqual([]);
      expect(component.active).toEqual('price');
      expect(component.filterItems).toEqual(component.pricelist);
    });

    it('should handle search query parameter with an single color string', () => {
      const queryParamsMock = { search: 'example', color: 'Black' };
      let colorsMock: colorsSchema[] = [...colors];
      colorsMock = colorsMock.map((el, i) => {
        if (i === 0) {
          el['checked'] = true;
        } else {
          el['checked'] = false;
        }
        return { ...el };
      });
      activatedRouteMock.queryParams = of(queryParamsMock);
      httpServiceMock.getColorsMethod.and.returnValue(of(colors));

      component.renderBrandsAndColorsOnSearch();
      component.colors.forEach((el, i) => {
        expect(el.checked).toEqual(colorsMock[i].checked);
      });
      expect(component.brands).toEqual([]);
      expect(component.active).toEqual('price');
      expect(component.filterItems).toEqual(component.pricelist);
    });
  });

  describe('renderBrandsAndColorsChangeInParams', () => {
    it('should not call getBrandsMethod and getColorsMethod on no category', () => {
      activatedRouteMock.params = of({ category: '' });
      httpServiceMock.getBrandsMethod.and.returnValue(of([]));
      httpServiceMock.getColorsMethod.and.returnValue(of([]));
      component.renderBrandsAndColorsChangeInParams();
      expect(httpServiceMock.getBrandsMethod).not.toHaveBeenCalled();
    });

    it('should call getBrandsMethod and getColorsMethod on category and set brands and filterItems and colors', () => {
      const paramsMock = { category: 'testCategory' };

      activatedRouteMock.params = of(paramsMock);
      let newcolors: colorsSchema[] = [...colors];
      newcolors = newcolors.map((el) => {
        el['checked'] = false;
        return el;
      });
      httpServiceMock.getBrandsMethod.and.returnValue(of(brandsOnsearch));
      httpServiceMock.getColorsMethod.and.returnValue(of(colors));

      component.renderBrandsAndColorsChangeInParams();

      expect(component.category).toEqual(paramsMock.category);
      expect(component.brands).toEqual(brandsOnsearch);
      expect(component.filterItems).toEqual(brandsOnsearch);
      component.colors.forEach((el, i) => {
        expect(el.checked).toEqual(newcolors[i].checked);
      });
    });
  });

  describe('onCheckedMethod', () => {
    it('should customize query parameters and update the route', () => {
      const eventMock = {
        source: { name: 'brand', value: 'roadstar', checked: true },
      };
      component.queryParams = { brand: ['brand1', 'brand2'] };
      // component.queryParams = { brand: ['Brand2'], sort: 'asc' };
      let newqueryParams = { ...component.queryParams };
      for (let key in newqueryParams) {
        if (key !== 'sort') {
          newqueryParams[key] = newqueryParams[key].join(',');
        }
      }
      spyOn(component, 'customizeQueryparams');
      spyOn(httpServiceMock.queryParams, 'next');
      component.onCheckedMethod(eventMock);

      expect(component.customizeQueryparams).toHaveBeenCalledWith(
        'roadstar',
        'brand',
        true
      );

      expect(httpServiceMock.queryParams.next).toHaveBeenCalledWith(
        component.queryParams
      );
      expect(httpServiceMock.addQueryParametersToRoute).toHaveBeenCalledWith(
        newqueryParams
      );
    });
    it('should handle the scenario when view is provided', () => {
      const eventMock = { name: 'brand', value: 'roadstar', checked: true };
      component.queryParams = { brand: ['brand1', 'brand2'] };
      let newqueryParams = { ...component.queryParams };
      for (let key in newqueryParams) {
        if (key !== 'sort') {
          newqueryParams[key] = newqueryParams[key].join(',');
        }
      }
      spyOn(component, 'customizeQueryparams');
      spyOn(httpServiceMock.queryParams, 'next');
      component.onCheckedMethod(eventMock, null, 'view');

      expect(component.customizeQueryparams).toHaveBeenCalledWith(
        'roadstar',
        'brand',
        true
      );

      expect(httpServiceMock.queryParams.next).toHaveBeenCalledWith(
        component.queryParams
      );
      expect(httpServiceMock.addQueryParametersToRoute).toHaveBeenCalledWith(
        newqueryParams
      );
    });
  });

  describe('customizeQueryparams', () => {
    it('should set queryParams of name to empty array if name is undefined and checked is true and add passed value to queryParams', () => {
      component.queryParams = { color: undefined };
      component.customizeQueryparams('red', 'color', true);

      expect(component.queryParams.color).toEqual(['red']);
    });

    it('should add not add value if value is already in query params and checked is true', () => {
      component.queryParams = { color: ['red', 'black'] };
      component.customizeQueryparams('red', 'color', true);

      expect(component.queryParams.color).toEqual(['red', 'black']);
    });

    it('should add delete value if value is already in query params and checked is false', () => {
      component.queryParams = { color: ['red', 'black'] };
      component.customizeQueryparams('red', 'color', false);

      expect(component.queryParams.color).toEqual(['black']);
    });

    it('should add delete property if property length is 0 and checked is false', () => {
      component.queryParams = { color: [] };
      component.customizeQueryparams('red', 'color', false);

      expect(component.queryParams).toEqual({});
    });
  });

  describe('Validcolors', () => {
    it('should return the correct color for each case', () => {
      expect(component.Validcolors('Navy Blue')).toEqual('rgb(60,68,119)');
      expect(component.Validcolors('Mustard')).toEqual('rgb(204,156,51)');
      expect(component.Validcolors('Burgundy')).toEqual('rgb(160,50,69)');
      expect(component.Validcolors('Camel Brown')).toEqual('rgb(180,154,89)');
      expect(component.Validcolors('Peach')).toEqual('rgb(255,229,180)');
      expect(component.Validcolors('Off White')).toEqual('rgb(242,242,242)');
      expect(component.Validcolors('Turquoise Blue')).toEqual(
        'rgb(64,224,208)'
      );
      expect(component.Validcolors('Coffee Brown')).toEqual('rgb(75,48,47)');
      expect(component.Validcolors('Multi')).toEqual('white');

      expect(component.Validcolors('Unknown Color')).toBeNull();
    });
  });

  describe('showFilterOptions', () => {
    it('should set filterItems and active based on the provided filter', () => {
      component.brands = brandsOnsearch;
      component.pricelist = pricefilterList;
      component.colors = colors;
      component.discountlist = discountfilterList;
      component.showFilterOptions('brand');
      expect(component.filterItems).toEqual(component.brands);
      expect(component.active).toEqual('brand');

      component.showFilterOptions('price');
      expect(component.filterItems).toEqual(component.pricelist);
      expect(component.active).toEqual('price');

      component.showFilterOptions('color');
      expect(component.filterItems).toEqual(component.colors);
      expect(component.active).toEqual('color');

      component.showFilterOptions('discount');
      expect(component.filterItems).toEqual(component.discountlist);
      expect(component.active).toEqual('discount');
    });
  });

  describe('toggleCheck', () => {
    it('should toggle check and update filterList when checked is true', () => {
      component.filterItems = [{ name: 'Test', value: '123', checked: false }];
      component.filterList = [];

      component.toggleCheck('Test', '123', false, 0);

      expect(component.filterItems[0].checked).toBe(true);
      expect(component.filterList).toEqual([
        { name: 'Test', value: '123', checked: true },
      ]);
    });

    it('should toggle check and update filterList when checked is false', () => {
      component.filterItems = [{ name: 'Test', value: '123', checked: true }];
      component.filterList = [{ name: 'Test', value: '123', checked: true }];

      component.toggleCheck('Test', '123', true, 0);

      expect(component.filterItems[0].checked).toBe(false);
      expect(component.filterList[0].checked).toBe(false);
    });

    it('should add to filterList when checked is true', () => {
      component.filterItems = [{ name: 'Test', value: '123', checked: false }];
      component.filterList = [];

      component.toggleCheck('Test', '123', false, 0);

      expect(component.filterList).toEqual([
        { name: 'Test', value: '123', checked: true },
      ]);
    });
  });

  describe('onApplyFilters', () => {
    it('should call onCheckedMethod with all values of filterList', async () => {
      component.queryParams = { brand: undefined };
      spyOn(component, 'onCheckedMethod');
      component.filterList = [
        { name: 'brand', value: '123', checked: true },
        { name: 'brand', value: '1234', checked: true },
      ];
      await component.onApplyFilters();
      for (let element of component.filterList) {
        expect(component.onCheckedMethod).toHaveBeenCalledWith(
          {
            name: element.name,
            value: element.value,
            checked: element.checked,
          },
          '',
          'view'
        );
      }
    });
  });

  describe('setDefaultFilters', () => {
    it('should set default filters for brands', () => {
      const queryParamsSpy = spyOn(httpServiceMock.queryParams, 'next');

      component.queryParams = { brand: ['Nike', 'Adidas'], color: ['Red'] };
      const brandsList = [
        { name: 'Nike', value: 'Nike', checked: false },
        { name: 'Adidas', value: 'Adidas', checked: false },
        { name: 'Puma', value: 'Puma', checked: false },
      ];

      component.setDefaultFilters('brand', brandsList, 'name');

      expect(queryParamsSpy).not.toHaveBeenCalled();
      expect(component.filterList).toEqual([
        { name: 'brand', value: 'Nike', checked: true },
        { name: 'brand', value: 'Adidas', checked: true },
      ]);
    });
  });

  it('should set default filters for colors', () => {
    const queryParamsSpy = spyOn(httpServiceMock.queryParams, 'next');

    component.queryParams = { brand: ['Nike'], color: ['Red', 'Blue'] };
    const colorsList = [
      { primaryColour: 'Red', checked: false },
      { primaryColour: 'Blue', checked: false },
      { primaryColour: 'Green', checked: false },
    ];

    component.setDefaultFilters('color', colorsList, 'primaryColour');

    expect(queryParamsSpy).not.toHaveBeenCalled();
    expect(component.filterList).toEqual([
      { name: 'color', value: 'Red', checked: true },
      { name: 'color', value: 'Blue', checked: true },
    ]);
  });

  it('should not set default filters when queryParams[key] is undefined', () => {
    const queryParamsSpy = spyOn(httpServiceMock.queryParams, 'next');

    component.queryParams = {
      brand: ['Nike'],
      color: ['Red'],
      discount: undefined,
    };
    const colorsList = [
      { primaryColour: 'Red', checked: false },
      { primaryColour: 'Blue', checked: false },
    ];

    component.setDefaultFilters('discount', colorsList, 'primaryColour');

    expect(queryParamsSpy).not.toHaveBeenCalled();
    expect(component.filterList).toEqual([]);
  });

  describe('ngOnDestroy', () => {
    it('should call onApplyFilters when filterApply is true', () => {
      const onApplyFiltersSpy = spyOn(component, 'onApplyFilters');

      component.filterApply = true;
      component.ngOnDestroy();

      expect(onApplyFiltersSpy).toHaveBeenCalled();
    });

    it('should not call onApplyFilters when filterApply is false', () => {
      const onApplyFiltersSpy = spyOn(component, 'onApplyFilters');

      component.filterApply = false;
      component.ngOnDestroy();

      expect(onApplyFiltersSpy).not.toHaveBeenCalled();
    });
  });
});
