import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderedProductsComponent } from './ordered-products.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatDialog } from '@angular/material/dialog';
import {
  MatBottomSheet,
  MatBottomSheetRef,
} from '@angular/material/bottom-sheet';
import { httpService } from 'src/app/services/products/products.service';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';
import { CancelOrderDialogComponent } from '../cancel-order-dialog/cancel-order-dialog.component';

describe('OrderedProductsComponent', () => {
  let component: OrderedProductsComponent;
  let fixture: ComponentFixture<OrderedProductsComponent>;
  let matDialogSpy: jasmine.SpyObj<MatDialog>;
  let matBottomSheetSpy: jasmine.SpyObj<MatBottomSheet>;
  let httpServiceSpy: jasmine.SpyObj<httpService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let activatedRouteMock: ActivatedRoute;
  beforeEach(async () => {
    const matDialogSpyObj = jasmine.createSpyObj('MatDialog', ['open']);
    const matBottomSheetSpyObj = jasmine.createSpyObj('MatBottomSheet', [
      'open',
    ]);
    const httpServiceSpyObj = jasmine.createSpyObj('httpService', [
      'scrollToTop',
    ]);
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [OrderedProductsComponent],
      imports: [SharedModule],
      providers: [
        { provide: MatDialog, useValue: matDialogSpyObj },
        { provide: MatBottomSheet, useValue: matBottomSheetSpyObj },
        { provide: httpService, useValue: httpServiceSpyObj },
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
        { provide: Router, useValue: routerSpyObj },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(OrderedProductsComponent);
    component = fixture.componentInstance;
    matDialogSpy = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;
    activatedRouteMock = TestBed.inject(ActivatedRoute);
    matBottomSheetSpy = TestBed.inject(
      MatBottomSheet
    ) as jasmine.SpyObj<MatBottomSheet>;
    httpServiceSpy = TestBed.inject(httpService) as jasmine.SpyObj<httpService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should call checkScreenWidth', () => {
      spyOn(component, 'checkScreenWidth');
      component.ngOnInit();
      expect(component.checkScreenWidth).toHaveBeenCalled();
    });
  });

  describe('navToOrdersDetails', () => {
    it('should navigate to orders details in checkOrders mode', () => {
      component.checkOrders = true;
      component.navToOrdersDetails(1, 2);

      expect(routerSpy.navigate).toHaveBeenCalledWith([1, 2], {
        relativeTo: activatedRouteMock,
      });
    });

    it('should navigate to orders details in non-checkOrders mode', () => {
      component.checkOrders = false;
      component.navToOrdersDetails(1, 2);

      expect(routerSpy.navigate).toHaveBeenCalledWith(
        ['/profile/orders', 1, 2],
        {}
      );
      expect(httpServiceSpy.scrollToTop).toHaveBeenCalled();
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
  describe('onResize', () => {
    it('should call checkScreenWidth on window resize', () => {
      spyOn(component, 'checkScreenWidth');

      window.dispatchEvent(new Event('resize'));

      expect(component.checkScreenWidth).toHaveBeenCalled();
    });
  });
  describe('openCancelOrderDialog', () => {
    it('should open cancel order dialog in mobile view', () => {
      component.isMobileView = true;
      matBottomSheetSpy.open.and.returnValue({
        afterDismissed: () => of(''),
      } as any);
      component.openCancelOrderDialog(new Event('click'), 1, 2);

      expect(matBottomSheetSpy.open).toHaveBeenCalledWith(
        jasmine.any(Function),
        {
          data: { orderId: 1, productId: 2, mobileView: true },
        }
      );
    });

    it('should open cancel order dialog in non-mobile view', () => {
      component.isMobileView = false;
      matDialogSpy.open.and.returnValue({ afterClosed: () => of('') } as any);
      component.openCancelOrderDialog(new Event('click'), 1, 2);

      expect(matDialogSpy.open).toHaveBeenCalledWith(
        CancelOrderDialogComponent,
        {
          width: '400px',
          height: '400px',
          position: { top: '30px' },
          data: { orderId: 1, productId: 2, mobileView: false },
        }
      );
    });
  });
});
