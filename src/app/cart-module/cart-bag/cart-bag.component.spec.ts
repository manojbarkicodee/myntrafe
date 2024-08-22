import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
  waitForAsync,
} from '@angular/core/testing';

import { CartBagComponent } from './cart-bag.component';
import { CartService } from 'src/app/services/cart/cart.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatDialog } from '@angular/material/dialog';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatSnackBar } from '@angular/material/snack-bar';
import { cartProductsData, pricingDetails } from 'src/app/testing/mockData';
import { Subject, Subscriber, of } from 'rxjs';
import { DeleteAlertDialogComponent } from 'src/app/shared/matdialogs/delete-alert-dialog/delete-alert-dialog.component';
import { CouponListComponent } from 'src/app/shared/matdialogs/coupon-list/coupon-list.component';
import { coupons } from '../staticData';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatStep } from '@angular/material/stepper';

describe('CartBagComponent', () => {
  let component: CartBagComponent;
  let fixture: ComponentFixture<CartBagComponent>;
  let mockCartService: jasmine.SpyObj<CartService>;
  let matDialogSpy: jasmine.SpyObj<MatDialog>;
  let matBottomSheetSpy: jasmine.SpyObj<MatBottomSheet>;
  let snackBar: jasmine.SpyObj<MatSnackBar>;
  beforeEach(waitForAsync(() => {
    const matDialogMock = jasmine.createSpyObj('MatDialog', ['open']);
    const matBottomSheetMock = jasmine.createSpyObj('MatBottomSheet', ['open']);
    mockCartService = jasmine.createSpyObj('CartService', [
      'getMethod_GetCartProducts',
    ]);
    mockCartService.cartProducts = new Subject();
    mockCartService.productsCount = new Subject();
    mockCartService.pricingDetails = new Subject();
    snackBar = jasmine.createSpyObj('MatSnackBar', ['open']);
    TestBed.configureTestingModule({
      declarations: [CartBagComponent],
      providers: [
        { provide: CartService, useValue: mockCartService },
        { provide: MatDialog, useValue: matDialogMock },
        { provide: MatBottomSheet, useValue: matBottomSheetMock },
        { provide: MatSnackBar, useValue: snackBar },
      ],
      imports: [SharedModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CartBagComponent);
    matDialogSpy = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;
    matBottomSheetSpy = TestBed.inject(
      MatBottomSheet
    ) as jasmine.SpyObj<MatBottomSheet>;
    component = fixture.componentInstance;
    mockCartService.getMethod_GetCartProducts.and.returnValue(
      of([{ products: cartProductsData }])
    );
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should call checkScreenWidth and getMethod_GetCartProducts and emit data', () => {
      spyOn(component, 'checkScreenWidth');
      spyOn(mockCartService.cartProducts, 'next');
      mockCartService.getMethod_GetCartProducts.and.returnValue(
        of([{ products: cartProductsData }])
      );
      component.ngOnInit();
      expect(component.checkScreenWidth).toHaveBeenCalled();
      expect(mockCartService.cartProducts.next).toHaveBeenCalledWith(
        cartProductsData
      );
    });

    it('should call checkScreenWidth and getMethod_GetCartProducts and subscribe to cartProducts subject and set required products', () => {
      spyOn(component, 'checkScreenWidth');
      spyOn(mockCartService.productsCount, 'next');
      mockCartService.getMethod_GetCartProducts.and.returnValue(
        of([{ products: cartProductsData }])
      );
      component.ngOnInit();
      mockCartService.cartProducts.next(cartProductsData);
      expect(component.checkScreenWidth).toHaveBeenCalled();
      expect(component.products).toEqual(cartProductsData);
      expect(component.productsCount).toEqual(cartProductsData.length);
      expect(mockCartService.productsCount.next).toHaveBeenCalledWith(
        cartProductsData.length
      );
    });
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

  describe('openSnackBar', () => {
    it('should open snackbar with provided message, action, and panelClass', () => {
      const message = 'Test Message';
      const action = 'Test Action';
      const panelClass = 'test-panel-class';

      component.openSnackBar(message, action, panelClass);

      expect(snackBar.open).toHaveBeenCalledWith(message, action, {
        duration: 1000,
        verticalPosition: component.verticalPosition,
        horizontalPosition: component.horizontalPosition,
        panelClass: [panelClass],
      });
    });
  });

  describe('showAlert', () => {
    it('should open snackbar with provided message and panelClass', () => {
      const openSnackBarSpy = spyOn(component, 'openSnackBar');

      const message = 'Test Message';
      const panelClass = 'test-panel-class';

      component.showAlert(message, panelClass);

      expect(openSnackBarSpy).toHaveBeenCalledWith(message, '', panelClass);
    });
  });

  describe('opendeleteDialog', () => {
    it('should open delete dialog with REMOVE action when check is true and isMobileView is false', () => {
      const dialogRefSpyObj = jasmine.createSpyObj({
        afterClosed: of([]),
      });
      matDialogSpy.open.and.returnValue(dialogRefSpyObj);
      spyOn(component, 'setSelectedProducts');
      let selectedpro = [...pricingDetails.selectedProducts].map((el, i) => {
        if (i == 0) {
          el.productId = 1052;
        } else {
          el.productId = 457;
        }
        return el;
      });

      component.selectedProducts = selectedpro;
      component.selected = 1;
      component.isMobileView = false;
      component.opendeleteDialog(true, new Event('click'));

      expect(matDialogSpy.open).toHaveBeenCalledWith(
        DeleteAlertDialogComponent,
        {
          data: {
            header: 'Remove 1 item',
            description: 'Are you sure you want to remove 1 from the bag.',
            btntext: 'REMOVE',
            single: false,
            deleteid: '1052,457',
            wishlidids: [{ productId: 1052 }, { productId: 457 }],
            mobileView: component.isMobileView,
          },
        }
      );
      expect(component.selectedProducts).toEqual([]);
      expect(component.selected).toEqual(0);
      expect(component.setSelectedProducts).toHaveBeenCalled();
    });
    it('should open wishlist dialog with MOVE action when check is false and isMobileView is false', () => {
      const dialogRefSpyObj = jasmine.createSpyObj({
        afterClosed: of([]),
      });
      matDialogSpy.open.and.returnValue(dialogRefSpyObj);
      spyOn(component, 'setSelectedProducts');
      let selectedpro = [...pricingDetails.selectedProducts].map((el, i) => {
        if (i == 0) {
          el.productId = 1052;
        } else {
          el.productId = 457;
        }
        return el;
      });

      component.selectedProducts = selectedpro;
      component.selected = 1;
      component.isMobileView = false;
      component.opendeleteDialog(false, new Event('click'));

      expect(matDialogSpy.open).toHaveBeenCalledWith(
        DeleteAlertDialogComponent,
        {
          data: {
            header: 'Move 1 item to wishlist',
            description: 'Are you sure you want to move 1 from the bag.',
            btntext: 'CANCEL',
            single: false,
            deleteid: '1052,457',
            wishlidids: [{ productId: 1052 }, { productId: 457 }],
            mobileView: component.isMobileView,
          },
        }
      );
      expect(component.selectedProducts).toEqual([]);
      expect(component.selected).toEqual(0);
      expect(component.setSelectedProducts).toHaveBeenCalled();
    });

    it('should open delete bottomsheet with REMOVE action when check is true and isMobileView is true', () => {
      const dialogRefSpyObj = jasmine.createSpyObj({
        afterDismissed: of([]),
      });
      matBottomSheetSpy.open.and.returnValue(dialogRefSpyObj);
      spyOn(component, 'setSelectedProducts');
      let selectedpro = [...pricingDetails.selectedProducts].map((el, i) => {
        if (i == 0) {
          el.productId = 1052;
        } else {
          el.productId = 457;
        }
        return el;
      });

      component.selectedProducts = selectedpro;
      component.selected = 1;
      component.isMobileView = true;
      component.opendeleteDialog(true, new Event('click'));

      expect(matBottomSheetSpy.open).toHaveBeenCalledWith(
        jasmine.any(Function),
        {
          data: {
            header: 'Remove 1 item',
            description: 'Are you sure you want to remove 1 from the bag.',
            btntext: 'REMOVE',
            single: false,
            deleteid: '1052,457',
            wishlidids: [{ productId: 1052 }, { productId: 457 }],
            mobileView: component.isMobileView,
          },
        }
      );
      expect(component.selectedProducts).toEqual([]);
      expect(component.selected).toEqual(0);
      expect(component.setSelectedProducts).toHaveBeenCalled();
    });

    it('should open wishlist bottomsheet with MOVE action when check is false and isMobileView is true', () => {
      const dialogRefSpyObj = jasmine.createSpyObj({
        afterDismissed: of([]),
      });
      matBottomSheetSpy.open.and.returnValue(dialogRefSpyObj);
      spyOn(component, 'setSelectedProducts');
      let selectedpro = [...pricingDetails.selectedProducts].map((el, i) => {
        if (i == 0) {
          el.productId = 1052;
        } else {
          el.productId = 457;
        }
        return el;
      });

      component.selectedProducts = selectedpro;
      component.selected = 1;
      component.isMobileView = true;
      component.opendeleteDialog(false, new Event('click'));

      expect(matBottomSheetSpy.open).toHaveBeenCalledWith(
        jasmine.any(Function),
        {
          data: {
            header: 'Move 1 item to wishlist',
            description: 'Are you sure you want to move 1 from the bag.',
            btntext: 'CANCEL',
            single: false,
            deleteid: '1052,457',
            wishlidids: [{ productId: 1052 }, { productId: 457 }],
            mobileView: component.isMobileView,
          },
        }
      );
      expect(component.selectedProducts).toEqual([]);
      expect(component.selected).toEqual(0);
      expect(component.setSelectedProducts).toHaveBeenCalled();
    });

    it('should call showAlert if slected is 0 and check is true with correct warning message', () => {
      component.selected = 0;
      spyOn(component, 'showAlert');
      component.opendeleteDialog(true, new Event('click'));
      expect(component.showAlert).toHaveBeenCalledWith(
        'Select any item to remove from bag',
        'warn'
      );
    });

    it('should call showAlert if slected is 0 and check is false with correct warning message', () => {
      component.selected = 0;
      spyOn(component, 'showAlert');
      component.opendeleteDialog(false, new Event('click'));
      expect(component.showAlert).toHaveBeenCalledWith(
        'Select any item to move to wishlist',
        'warn'
      );
    });
  });

  describe('openCouponList', () => {
    it('it should call showAlert on selected is 0', () => {
      spyOn(component, 'showAlert');
      component.selected = 0;
      component.openCouponList();
      expect(component.showAlert).toHaveBeenCalledWith(
        'Select any item to apply coupon',
        'warn'
      );
    });

    it('should open coupons dialog with correct data on isMobileView is true on edit mode is false and applied is true', () => {
      let config = {
        width: '100vw',
        height: '100vh',
        marginTop: '0px',
        maxWidth: '100vw',
        position: { top: '0px' },
      };
      component.selected = 1;
      component.isMobileView = true;
      let selectedCoupons = [
        {
          couponCode: 'MYNTRA100',
          saving: '100',
          minimumPurchaseDescription:
            'RS.100 off on minimum purchase of Rs.699',
          minimumPurchaseAmount: 699,
          checked: true,
        },
        {
          couponCode: 'MYNTRA120',
          saving: '120',
          minimumPurchaseDescription:
            'RS.120 off on minimum purchase of Rs.1199',
          minimumPurchaseAmount: 1199,
          checked: true,
        },
      ];
      const dialogRefSpyObj = jasmine.createSpyObj({
        afterClosed: of({
          appliedCoupons: selectedCoupons,
          applied: true,
          totalSave: 220,
        }),
      });
      component.pricingDetails = {
        totalMrp: 3698,
        discountOnMrp: 2442,
        totalAmount: 1256,
        estimatedDeliveryDate: '20 Jan 2024',
      };
      matDialogSpy.open.and.returnValue(dialogRefSpyObj);

      component.openCouponList();
      fixture.detectChanges();

      expect(matDialogSpy.open).toHaveBeenCalledWith(CouponListComponent, {
        ...config,
        data: {
          couponList: coupons,
          totalamount: 1256,
          edit: false,
        },
      });
      expect(component.pricingDetails.totalAmount).toEqual(1256 - 220);
      expect(component.totalSavedAmount).toEqual(220);
      expect(component.couponEditMode).toBe(true);
      expect(component.coupons).toEqual(selectedCoupons);
    });

    it('should open coupons dialog with correct data on isMobileView is true on edit mode is true and applied is true', () => {
      let config = {
        width: '100vw',
        height: '100vh',
        marginTop: '0px',
        maxWidth: '100vw',
        position: { top: '0px' },
      };
      component.selected = 1;
      component.isMobileView = true;
      let selectedCoupons = [
        {
          couponCode: 'MYNTRA100',
          saving: '100',
          minimumPurchaseDescription:
            'RS.100 off on minimum purchase of Rs.699',
          minimumPurchaseAmount: 699,
          checked: true,
        },
        {
          couponCode: 'MYNTRA120',
          saving: '120',
          minimumPurchaseDescription:
            'RS.120 off on minimum purchase of Rs.1199',
          minimumPurchaseAmount: 1199,
          checked: true,
        },
      ];
      component.coupons = selectedCoupons;
      component.couponEditMode = true;
      const dialogRefSpyObj = jasmine.createSpyObj({
        afterClosed: of({
          appliedCoupons: selectedCoupons,
          applied: true,
          totalSave: 220,
        }),
      });
      component.pricingDetails = {
        totalMrp: 3698,
        discountOnMrp: 2442,
        totalAmount: 1256,
        estimatedDeliveryDate: '20 Jan 2024',
      };
      matDialogSpy.open.and.returnValue(dialogRefSpyObj);

      component.openCouponList();
      fixture.detectChanges();

      expect(matDialogSpy.open).toHaveBeenCalledWith(CouponListComponent, {
        ...config,
        data: {
          couponList: selectedCoupons,
          totalamount: 1256,
          edit: true,
        },
      });
      expect(component.pricingDetails.totalAmount).toEqual(1256 - 220);
      expect(component.totalSavedAmount).toEqual(220);
      expect(component.couponEditMode).toBe(true);
      expect(component.coupons).toEqual(selectedCoupons);
    });
    it('should open coupons dialog with correct data on isMobileView is true on edit mode is true and applied is false', () => {
      let config = {
        width: '100vw',
        height: '100vh',
        marginTop: '0px',
        maxWidth: '100vw',
        position: { top: '0px' },
      };
      component.selected = 1;
      component.isMobileView = true;
      let selectedCoupons = [
        {
          couponCode: 'MYNTRA100',
          saving: '100',
          minimumPurchaseDescription:
            'RS.100 off on minimum purchase of Rs.699',
          minimumPurchaseAmount: 699,
          checked: true,
        },
        {
          couponCode: 'MYNTRA120',
          saving: '120',
          minimumPurchaseDescription:
            'RS.120 off on minimum purchase of Rs.1199',
          minimumPurchaseAmount: 1199,
          checked: true,
        },
      ];

      const dialogRefSpyObj = jasmine.createSpyObj({
        afterClosed: of({
          appliedCoupons: coupons,
          applied: false,
          totalSave: 220,
        }),
      });
      component.pricingDetails = {
        totalMrp: 3698,
        discountOnMrp: 2442,
        totalAmount: 1256,
        estimatedDeliveryDate: '20 Jan 2024',
      };
      matDialogSpy.open.and.returnValue(dialogRefSpyObj);

      component.openCouponList();
      fixture.detectChanges();

      expect(matDialogSpy.open).toHaveBeenCalledWith(CouponListComponent, {
        ...config,
        data: {
          couponList: coupons,
          totalamount: 1256,
          edit: false,
        },
      });
      expect(component.pricingDetails.totalAmount).toEqual(1256 - 220);
      expect(component.totalSavedAmount).toEqual(220);
      expect(component.couponEditMode).toBe(false);
      expect(component.coupons).toEqual(coupons);
    });

    it('should open coupons dialog with correct data on isMobileView is false on edit mode is false and applied is true', () => {
      let config = {
        width: '500px',
        height: '500px',
        position: { top: '30px' },
      };
      component.selected = 1;
      component.isMobileView = false;
      let selectedCoupons = [
        {
          couponCode: 'MYNTRA100',
          saving: '100',
          minimumPurchaseDescription:
            'RS.100 off on minimum purchase of Rs.699',
          minimumPurchaseAmount: 699,
          checked: true,
        },
        {
          couponCode: 'MYNTRA120',
          saving: '120',
          minimumPurchaseDescription:
            'RS.120 off on minimum purchase of Rs.1199',
          minimumPurchaseAmount: 1199,
          checked: true,
        },
      ];
      const dialogRefSpyObj = jasmine.createSpyObj({
        afterClosed: of({
          appliedCoupons: selectedCoupons,
          applied: true,
          totalSave: 220,
        }),
      });
      component.pricingDetails = {
        totalMrp: 3698,
        discountOnMrp: 2442,
        totalAmount: 1256,
        estimatedDeliveryDate: '20 Jan 2024',
      };
      matDialogSpy.open.and.returnValue(dialogRefSpyObj);

      component.openCouponList();
      fixture.detectChanges();

      expect(matDialogSpy.open).toHaveBeenCalledWith(CouponListComponent, {
        ...config,
        data: {
          couponList: coupons,
          totalamount: 1256,
          edit: false,
        },
      });
      expect(component.pricingDetails.totalAmount).toEqual(1256 - 220);
      expect(component.totalSavedAmount).toEqual(220);
      expect(component.couponEditMode).toBe(true);
      expect(component.coupons).toEqual(selectedCoupons);
    });
  });

  describe('setSelectedProducts', () => {
    it('should set selectedProducts and selected if selectedProducts.length>0 call setPricingDetails and check for selectAll products', fakeAsync(() => {
      let selectedpro = [...pricingDetails.selectedProducts].map((el, i) => {
        if (i == 0) {
          el.productId = 1052;
        } else {
          el.productId = 457;
        }
        return el;
      });
      let pricing = {
        totalMrp: 3698,
        discountOnMrp: 2442,
        totalAmount: 1256,
        estimatedDeliveryDate: '20 Jan 2024',
      };
      spyOn(component, 'setPricingDetails').and.returnValue(pricing);
      component.productsCount = 2;

      const matCheckboxSpy = jasmine.createSpyObj('MatCheckbox', ['checked']);
      component.maincheckbox = matCheckboxSpy;
      component.setSelectedProducts(selectedpro);

      expect(component.selectedProducts).toEqual(selectedpro);
      expect(component.setPricingDetails).toHaveBeenCalled();
      expect(component.pricingDetails).toEqual(pricing);
      expect(component.intermediate).toBe(false);
      expect(component.maincheckbox.checked).toBe(true);
      expect(component.selectAll).toBe(true);
    }));

    it('should set selectedProducts and selected if selectedProducts.length>0 call setPricingDetails and check for intermediate state', fakeAsync(() => {
      let selectedpro = [...pricingDetails.selectedProducts].map((el, i) => {
        if (i == 0) {
          el.productId = 1052;
        } else {
          el.productId = 457;
        }
        return el;
      });
      let pricing = {
        totalMrp: 3698,
        discountOnMrp: 2442,
        totalAmount: 1256,
        estimatedDeliveryDate: '20 Jan 2024',
      };
      component.productsCount = 3;
      spyOn(component, 'setPricingDetails').and.returnValue(pricing);

      const matCheckboxSpy = jasmine.createSpyObj('MatCheckbox', ['checked']);
      component.maincheckbox = matCheckboxSpy;
      component.setSelectedProducts(selectedpro);

      expect(component.selectedProducts).toEqual(selectedpro);
      expect(component.setPricingDetails).toHaveBeenCalled();
      expect(component.pricingDetails).toEqual(pricing);
      expect(component.intermediate).toBe(true);
    }));

    it('should set selectedProducts and selected if selectedProducts.length>0 call setPricingDetails and check for intermediate state', fakeAsync(() => {
      let selectedpro = [...pricingDetails.selectedProducts].map((el, i) => {
        if (i == 0) {
          el.productId = 1052;
        } else {
          el.productId = 457;
        }
        return el;
      });
      let pricing = {
        totalMrp: 3698,
        discountOnMrp: 2442,
        totalAmount: 1256,
        estimatedDeliveryDate: '20 Jan 2024',
      };
      component.productsCount = 1;
      spyOn(component, 'setPricingDetails').and.returnValue(pricing);

      const matCheckboxSpy = jasmine.createSpyObj('MatCheckbox', ['checked']);
      component.maincheckbox = matCheckboxSpy;
      component.setSelectedProducts(selectedpro);

      expect(component.selectedProducts).toEqual(selectedpro);
      expect(component.setPricingDetails).toHaveBeenCalled();
      expect(component.pricingDetails).toEqual(pricing);
      expect(component.intermediate).toBe(false);
      expect(component.selectAll).toBe(false);
      expect(component.maincheckbox.checked).toBe(false);
    }));

    it('should set selectedProducts and selected if selectedProducts.length=0 not to call setPricingDetails and check for intermediate state', fakeAsync(() => {
      let pricing = {
        totalMrp: 0,
        totalAmount: 0,
        discountOnMrp: 0,
        estimatedDeliveryDate: '',
      };
      spyOn(component, 'setPricingDetails').and.returnValue(pricing);

      const matCheckboxSpy = jasmine.createSpyObj('MatCheckbox', ['checked']);
      component.maincheckbox = matCheckboxSpy;
      component.setSelectedProducts([]);

      expect(component.selectedProducts).toEqual([]);
      expect(component.setPricingDetails).not.toHaveBeenCalled();
      expect(component.pricingDetails).toEqual(pricing);
      expect(component.intermediate).toBe(false);
      expect(component.selectAll).toBe(false);
      expect(component.maincheckbox.checked).toBe(false);
    }));
  });

  describe('selectAllProducts', () => {
    it('should set selectAll and check for checked flag if it"s true set selectedProducts and pricingDetails', () => {
      component.products = cartProductsData;
      let pricing = {
        totalMrp: 3698,
        discountOnMrp: 2442,
        totalAmount: 1256,
        estimatedDeliveryDate: '20 Jan 2024',
      };
      spyOn(component, 'setPricingDetails').and.returnValue(pricing);
      let modifiedProducts = component.products.map((product) => {
        return {
          productId: product.id,
          mrp: product.mrp * product.productDetails.quantity,
          price: product.price * product.productDetails.quantity,
          discount: product.discount * product.productDetails.quantity,
          size: product.productDetails.size,
          quantity: product.productDetails.quantity,
          deliveryDate: product.deliveyDate,
          productImage: product.productimage,
        };
      });
      component.selectAllProducts({ checked: true });
      expect(component.selectAll).toBe(true);
      expect(component.intermediate).toBe(false);
      expect(component.selectedProducts).toEqual(modifiedProducts);
      expect(component.setPricingDetails).toHaveBeenCalled();
      expect(component.pricingDetails).toEqual(pricing);
      expect(component.selected).toEqual(cartProductsData.length);
    });

    it('should set selectAll and check for checked flag if it"s false set selectedProducts and pricingDetails', () => {
      component.products = cartProductsData;
      let pricing = {
        totalMrp: 0,
        totalAmount: 0,
        discountOnMrp: 0,
        estimatedDeliveryDate: '',
      };
      spyOn(component, 'setPricingDetails').and.returnValue(pricing);

      component.selectAllProducts({ checked: false });
      expect(component.selectAll).toBe(false);
      expect(component.intermediate).toBe(false);
      expect(component.selectedProducts).toEqual([]);
      expect(component.setPricingDetails).not.toHaveBeenCalled();
      expect(component.pricingDetails).toEqual(pricing);
      expect(component.selected).toEqual(0);
    });
  });

  describe('setPricingDetails', () => {
    it('should return priceDetails and set other required properties', () => {
      let pricing = {
        totalMrp: 3698,
        discountOnMrp: 2442,
        totalAmount: 1256,
        estimatedDeliveryDate: '20 Jan 2024',
      };
      component.selectedProducts = [
        {
          productId: 1059,
          mrp: 3698,
          price: 1256,
          discount: 2442,
          size: 'L',
          quantity: 2,
          deliveryDate: '20 Jan 2024',
          productImage:
            'http://assets.myntassets.com/assets/images/7488102/2019/8/22/8002a744-0dad-4dbb-9481-cf0090134c3b1566454086786-Dennis-Lingo-Men-Pink-Slim-Fit-Solid-Casual-Shirt-9891566454-1.jpg',
        },
      ];

      let result = component.setPricingDetails();
      expect(result.totalMrp).toBe(3698);
      expect(result.discountOnMrp).toBe(2442);
      expect(result.totalAmount).toBe(1256);
      expect(result.estimatedDeliveryDate).toBe('20 Jan 2024');
      expect(component.couponEditMode).toBeFalse();
      expect(component.coupons).toEqual(coupons);
    });
  });
  describe('methodTonavToAddress', () => {
    it('should call showAlert with correct data for selected is 0', () => {
      component.selected = 0;
      spyOn(component, 'showAlert');
      component.methodTonavToAddress();
      expect(component.showAlert).toHaveBeenCalledWith(
        'Select atleast one item in bag to place order',
        'warn'
      );
    });

    it('should call showAlert with correct data for selected is not 0', () => {
      component.selected = 2;
      let pricing = {
        totalMrp: 3698,
        discountOnMrp: 2442,
        totalAmount: 1256,
        estimatedDeliveryDate: '20 Jan 2024',
      };
      let matStepMock = jasmine.createSpyObj('MatStep', ['completed']);
      let matStepperMock = jasmine.createSpyObj('MatStepper', ['next']);
      component.stepper = matStepperMock;
      component.step = matStepMock;
      component.step.completed = false;
      component.totalSavedAmount = 220;
      component.pricingDetails = pricing;
      spyOn(mockCartService.pricingDetails, 'next');
      component.methodTonavToAddress();
      expect(mockCartService.pricingDetails.next).toHaveBeenCalledWith({
        ...pricing,
        couponDiscount: component.totalSavedAmount,
        selectedProducts: component.selectedProducts,
      });
      expect(component.step.completed).toBeTruthy();
      expect(component.stepper.next).toHaveBeenCalled();
    });
  });

  describe('ngOnDestroy', () => {
    it('should unsubscribe if cartProductsSubsciption is there', () => {
      component.cartProductsSubsciption = new Subscriber();
      spyOn(component.cartProductsSubsciption, 'unsubscribe');
      component.ngOnDestroy();
      expect(component.cartProductsSubsciption.unsubscribe).toHaveBeenCalled();
    });
  });
});
