import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdersDetailsComponent } from './orders-details.component';
import { ProfileService } from 'src/app/services/profile/profile.service';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { of } from 'rxjs';
import { orderredDetails } from 'src/app/testing/mockData';
import { ShowShoppingDetailsDialogComponent } from '../show-shopping-details-dialog/show-shopping-details-dialog.component';
import { compilePipeFromMetadata } from '@angular/compiler';

describe('OrdersDetailsComponent', () => {
  let component: OrdersDetailsComponent;
  let fixture: ComponentFixture<OrdersDetailsComponent>;
  let mockProfileService: jasmine.SpyObj<ProfileService>;
  let mockActivatedRoute: jasmine.SpyObj<ActivatedRoute>;
  let mockMatDialog: jasmine.SpyObj<MatDialog>;
  let mockMatBottomSheet: jasmine.SpyObj<MatBottomSheet>;
  let router: jasmine.SpyObj<Router>;
  beforeEach(async () => {
    mockProfileService = jasmine.createSpyObj('ProfileService', [
      'getOrderedDetails',
    ]);
    mockActivatedRoute = jasmine.createSpyObj('ActivatedRoute', [], {
      params: of({ orderId: '1', productId: '1052' }),
    });
    mockMatDialog = jasmine.createSpyObj('MatDialog', ['open']);
    mockMatBottomSheet = jasmine.createSpyObj('MatBottomSheet', ['open']);
    router = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [OrdersDetailsComponent],
      providers: [
        { provide: ProfileService, useValue: mockProfileService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: MatDialog, useValue: mockMatDialog },
        { provide: MatBottomSheet, useValue: mockMatBottomSheet },
        { provide: Router, useValue: router },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(OrdersDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should call checkScreenWidth and getOrdersDetailsOnChangeInQueryParams', () => {
      spyOn(component, 'checkScreenWidth');
      spyOn(component, 'getOrdersDetailsOnChangeInQueryParams');
      mockProfileService.getOrderedDetails.and.returnValue(of(orderredDetails));
      component.ngOnInit();
      expect(component.checkScreenWidth).toHaveBeenCalled();
      expect(
        component.getOrdersDetailsOnChangeInQueryParams
      ).toHaveBeenCalled();
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

  describe('openShopingDetailsDialog', () => {
    it('should call _bottomSheet with correct data for isMobileView is true and singleData is true', () => {
      component.isMobileView = true;
      component.product = orderredDetails[0].products.filter((product) => {
        return product.id === 1052;
      })[0];
      mockMatBottomSheet.open.and.returnValue({
        afterDismissed: () => of(''),
      } as any);
      component.openShopingDetailsDialog(new Event('click'), true);
      expect(mockMatBottomSheet.open).toHaveBeenCalledWith(
        jasmine.any(Function),
        {
          data: { mobileView: true, ...component.product },
        }
      );
    });
    it('should call _bottomSheet with correct data for isMobileView is true and singleData is false', () => {
      component.isMobileView = true;
      component.product = orderredDetails[0].products.filter((product) => {
        return product.id === 1052;
      })[0];
      component.orderDetails = orderredDetails.filter((order) => {
        return order.id === 1;
      })[0];
      mockMatBottomSheet.open.and.returnValue({
        afterDismissed: () => of(''),
      } as any);
      component.openShopingDetailsDialog(new Event('click'), false);
      expect(mockMatBottomSheet.open).toHaveBeenCalledWith(
        jasmine.any(Function),
        {
          data: { mobileView: true, ...component.orderDetails },
        }
      );
    });
    it('should call dialog with correct data for isMobileView is false and singleData is true', () => {
      component.isMobileView = false;
      component.product = orderredDetails[0].products.filter((product) => {
        return product.id === 1052;
      })[0];
      mockMatDialog.open.and.returnValue({
        afterClosed: () => of(''),
      } as any);
      component.openShopingDetailsDialog(new Event('click'), true);
      expect(mockMatDialog.open).toHaveBeenCalledWith(
        ShowShoppingDetailsDialogComponent,
        {
          width: '500px',
          height: '',
          position: { top: '100px' },
          data: { mobileView: false, ...component.product },
        }
      );
    });

    it('should call dialog with correct data for isMobileView is false and singleData is true', () => {
      component.isMobileView = false;
      component.product = orderredDetails[0].products.filter((product) => {
        return product.id === 1052;
      })[0];
      component.orderDetails = orderredDetails.filter((order) => {
        return order.id === 1;
      })[0];
      mockMatDialog.open.and.returnValue({
        afterClosed: () => of(''),
      } as any);
      component.openShopingDetailsDialog(new Event('click'), false);
      expect(mockMatDialog.open).toHaveBeenCalledWith(
        ShowShoppingDetailsDialogComponent,
        {
          width: '550px',
          height: '420px',
          position: { top: '100px' },
          data: { mobileView: false, ...component.orderDetails },
        }
      );
    });
  });

  describe('getOrdersDetailsOnChangeInQueryParams', () => {
    it('should call getOrderedDetails and set orderDetails and deliveryAddress products', () => {
      mockProfileService.getOrderedDetails.and.returnValue(of(orderredDetails));
      orderredDetails[0].products = orderredDetails[0].products.map((el) => {
        el.orderId = 1;
        return el;
      });
      component.getOrdersDetailsOnChangeInQueryParams();
      expect(component.orderDetails).toEqual(orderredDetails[0]);
      expect(component.deliveryAddress).toEqual(orderredDetails[0].address);
      expect(component.product).toEqual(orderredDetails[0].products[0]);
      expect(component.products).toEqual([orderredDetails[0].products[1]]);
    });
  });

  describe('navToProduct',()=>{
   it('should navigate to products',()=>{
    component.navToProduct(1,'mens')
    expect(router.navigate).toHaveBeenCalledWith(['/products', 'mens', 1])
   })
  })
});
