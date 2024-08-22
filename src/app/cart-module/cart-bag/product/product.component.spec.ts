import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ProductComponent } from './product.component';
import { MatDialog } from '@angular/material/dialog';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { SharedModule } from 'src/app/shared/shared.module';
import { cartProductsData, pricingDetails } from 'src/app/testing/mockData';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SimpleChanges } from '@angular/core';
import { SizelistComponent } from 'src/app/shared/matdialogs/sizelist/sizelist.component';
import { of } from 'rxjs';
import { QuantitylistComponent } from 'src/app/shared/matdialogs/quantitylist/quantitylist.component';
import { DeleteAlertDialogComponent } from 'src/app/shared/matdialogs/delete-alert-dialog/delete-alert-dialog.component';

describe('ProductComponent', () => {
  let component: ProductComponent;
  let fixture: ComponentFixture<ProductComponent>;
  let matDialogSpy: jasmine.SpyObj<MatDialog>;
  let matBottomSheetSpy: jasmine.SpyObj<MatBottomSheet>;
  beforeEach(async () => {
    const matDialogMock = jasmine.createSpyObj('MatDialog', ['open']);
    const matBottomSheetMock = jasmine.createSpyObj('MatBottomSheet', ['open']);
    await TestBed.configureTestingModule({
      declarations: [ProductComponent],
      providers: [
        { provide: MatDialog, useValue: matDialogMock },
        { provide: MatBottomSheet, useValue: matBottomSheetMock },
      ],
      imports: [SharedModule, ReactiveFormsModule, FormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductComponent);
    matDialogSpy = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;
    matBottomSheetSpy = TestBed.inject(
      MatBottomSheet
    ) as jasmine.SpyObj<MatBottomSheet>;
    component = fixture.componentInstance;
    component.product = cartProductsData[0];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnChanges', () => {
    it('should set checkBoxValue and call setDeliveryDate when checkedAll changes', () => {
      const changes: SimpleChanges = {
        checkedAll: {
          currentValue: true,
          previousValue: true, // Add previousValue to fix the error
          firstChange: false, // Add firstChange to fix the error
          isFirstChange: () => false, // Add isFirstChange to fix the error
        },
      };

      spyOn(component, 'setDeliveryDate');

      component.ngOnChanges(changes);

      expect(component.checkBoxValue).toBe(true);
      expect(component.setDeliveryDate).toHaveBeenCalled();
    });

    it('should not set checkBoxValue or call setDeliveryDate when checkedAll does not change', () => {
      const changes: SimpleChanges = {};

      spyOn(component, 'setDeliveryDate');

      component.ngOnChanges(changes);

      expect(component.checkBoxValue).toBeFalse();
      expect(component.setDeliveryDate).not.toHaveBeenCalled();
    });
  });

  describe('ngOnInit', () => {
    it('should set required properties', () => {
      let deleteData = {
        header: 'Move From Bag',
        description: 'Are you sure you want to move this item from bag?',
        btntext: 'REMOVE',
        deleteid: component.product.id,
        wishlidids: [{ productId: component.product.id }],
        single: true,
        imageurl: component.product.productimage,
        mobileView: component.isMobileView,
      };
      component.ngOnInit();
      expect(component.deleteDialogData).toEqual(deleteData);
      expect(component.price).toEqual(
        cartProductsData[0].productDetails.quantity * cartProductsData[0].price
      );
      expect(component.mrp).toEqual(
        cartProductsData[0].mrp * cartProductsData[0].productDetails.quantity
      );
      expect(component.discount).toEqual(
        cartProductsData[0].discount *
          cartProductsData[0].productDetails.quantity
      );
    });
  });

  describe('openSizeDialog', () => {
    it('should open size dialog in a regular view if checkBoxValue is true', waitForAsync(() => {
      component.isMobileView = false;
      component.checkBoxValue = true;

      spyOn(component.selectedProducts, 'emit');
      const dialogRefSpyObj = jasmine.createSpyObj({
        afterClosed: of('sizeData'),
      });
      matDialogSpy.open.and.returnValue(dialogRefSpyObj);
      let selectedpro = [...pricingDetails.selectedProducts].map((el, i) => {
        if (i == 0) {
          el.productId = 1052;
        } else {
          el.productId = 457;
        }
        return el;
      });

      // console.log(selectedpro);
      component.selectedProductsdata = selectedpro;
      fixture.detectChanges();
      component.openSizeDialog(new Event('click'), 1);

      fixture.whenStable().then(() => {
        expect(matDialogSpy.open).toHaveBeenCalledWith(SizelistComponent, {
          data: { wishlistproduct: component.product, checkRoute: false },
        });
        expect(component.product.productDetails.size).toBe('sizeData');
        expect(component.selectedProducts.emit).toHaveBeenCalledWith(
          component.selectedProductsdata
        );
      });
    }));
    it('should open size dialog in a regular view if checkBoxValue is false but not emit data from selectedProducts', waitForAsync(() => {
      component.isMobileView = false;
      component.checkBoxValue = false;

      spyOn(component.selectedProducts, 'emit');
      const dialogRefSpyObj = jasmine.createSpyObj({
        afterClosed: of('sizeData'),
      });
      matDialogSpy.open.and.returnValue(dialogRefSpyObj);
      let selectedpro = [...pricingDetails.selectedProducts].map((el, i) => {
        if (i == 0) {
          el.productId = 1052;
        } else {
          el.productId = 457;
        }
        return el;
      });

      // console.log(selectedpro);
      component.selectedProductsdata = selectedpro;
      fixture.detectChanges();
      component.openSizeDialog(new Event('click'), 1);

      fixture.whenStable().then(() => {
        expect(matDialogSpy.open).toHaveBeenCalledWith(SizelistComponent, {
          data: { wishlistproduct: component.product, checkRoute: false },
        });
        expect(component.product.productDetails.size).toBe('sizeData');
        expect(component.selectedProducts.emit).not.toHaveBeenCalledWith(
          component.selectedProductsdata
        );
      });
    }));

    it('should open size dialog in a mobile view if checkBoxValue is true', waitForAsync(() => {
      component.isMobileView = true;
      component.checkBoxValue = true;
      spyOn(component.selectedProducts, 'emit');
      const bottomSheetRefSpyObj = jasmine.createSpyObj({
        afterDismissed: of('sizeData'),
      });
      matBottomSheetSpy.open.and.returnValue(bottomSheetRefSpyObj);
      let selectedpro = [...pricingDetails.selectedProducts].map((el, i) => {
        if (i == 0) {
          el.productId = 1052;
        } else {
          el.productId = 457;
        }
        return el;
      });

      // console.log(selectedpro);
      component.selectedProductsdata = selectedpro;
      fixture.detectChanges();
      component.openSizeDialog(new Event('click'), 1);

      fixture.whenStable().then(() => {
        expect(matBottomSheetSpy.open).toHaveBeenCalledWith(
          jasmine.any(Function),
          {
            data: {
              wishlistproduct: component.product,
              checkRoute: false,
              mobileView: true,
            },
          }
        );
        expect(component.product.productDetails.size).toBe('sizeData');
        expect(component.selectedProducts.emit).toHaveBeenCalledWith(
          component.selectedProductsdata
        );
      });
    }));
    it('should open size dialog in a mobile view if checkBoxValue is false should not emit data from selectedData', waitForAsync(() => {
      component.isMobileView = true;
      component.checkBoxValue = false;
      spyOn(component.selectedProducts, 'emit');
      const bottomSheetRefSpyObj = jasmine.createSpyObj({
        afterDismissed: of('sizeData'),
      });
      matBottomSheetSpy.open.and.returnValue(bottomSheetRefSpyObj);
      let selectedpro = [...pricingDetails.selectedProducts].map((el, i) => {
        if (i == 0) {
          el.productId = 1052;
        } else {
          el.productId = 457;
        }
        return el;
      });

      // console.log(selectedpro);
      component.selectedProductsdata = selectedpro;
      fixture.detectChanges();
      component.openSizeDialog(new Event('click'), 1);

      fixture.whenStable().then(() => {
        expect(matBottomSheetSpy.open).toHaveBeenCalledWith(
          jasmine.any(Function),
          {
            data: {
              wishlistproduct: component.product,
              checkRoute: false,
              mobileView: true,
            },
          }
        );
        expect(component.product.productDetails.size).toBe('sizeData');
        expect(component.selectedProducts.emit).not.toHaveBeenCalledWith(
          component.selectedProductsdata
        );
      });
    }));
  });

  describe('openQuantityDialog', () => {
    it('should open quantity dialog in a regular view if checkBoxValue is true', waitForAsync(() => {
      component.isMobileView = false;
      component.checkBoxValue = true;

      spyOn(component.selectedProducts, 'emit');
      const dialogRefSpyObj = jasmine.createSpyObj({
        afterClosed: of(2),
      });
      matDialogSpy.open.and.returnValue(dialogRefSpyObj);
      let selectedpro = [...pricingDetails.selectedProducts].map((el, i) => {
        if (i == 0) {
          el.productId = 1052;
        } else {
          el.productId = 457;
        }
        return el;
      });

      // console.log(selectedpro);
      component.selectedProductsdata = selectedpro;
      fixture.detectChanges();
      component.openQuantityDialog(new Event('click'));

      fixture.whenStable().then(() => {
        expect(matDialogSpy.open).toHaveBeenCalledWith(QuantitylistComponent, {
          data: { mobileView: component.isMobileView },
        });
        expect(component.product.productDetails.quantity).toBe(2);
        expect(component.price).toEqual(component.product.price * 2);
        expect(component.discount).toEqual(component.product.discount * 2);
        expect(component.mrp).toEqual(component.product.mrp * 2);
        expect(component.selectedProducts.emit).toHaveBeenCalledWith(
          component.selectedProductsdata
        );
      });
    }));

    it('should open quantity dialog in a regular view if checkBoxValue is false should not emit data from selectedData', waitForAsync(() => {
      component.isMobileView = false;
      component.checkBoxValue = false;

      spyOn(component.selectedProducts, 'emit');
      const dialogRefSpyObj = jasmine.createSpyObj({
        afterClosed: of(2),
      });
      matDialogSpy.open.and.returnValue(dialogRefSpyObj);
      let selectedpro = [...pricingDetails.selectedProducts].map((el, i) => {
        if (i == 0) {
          el.productId = 1052;
        } else {
          el.productId = 457;
        }
        return el;
      });

      // console.log(selectedpro);
      component.selectedProductsdata = selectedpro;
      fixture.detectChanges();
      component.openQuantityDialog(new Event('click'));

      fixture.whenStable().then(() => {
        expect(matDialogSpy.open).toHaveBeenCalledWith(QuantitylistComponent, {
          data: { mobileView: component.isMobileView },
        });
        expect(component.product.productDetails.quantity).toBe(2);
        expect(component.price).toEqual(component.product.price * 2);
        expect(component.discount).toEqual(component.product.discount * 2);
        expect(component.mrp).toEqual(component.product.mrp * 2);
        expect(component.selectedProducts.emit).not.toHaveBeenCalledWith(
          component.selectedProductsdata
        );
      });
    }));
    it('should open quantity dialog in a mobile view if checkBoxValue is true', waitForAsync(() => {
      component.isMobileView = true;
      component.checkBoxValue = true;
      spyOn(component.selectedProducts, 'emit');
      const bottomSheetRefSpyObj = jasmine.createSpyObj({
        afterDismissed: of(2),
      });
      matBottomSheetSpy.open.and.returnValue(bottomSheetRefSpyObj);
      let selectedpro = [...pricingDetails.selectedProducts].map((el, i) => {
        if (i == 0) {
          el.productId = 1052;
        } else {
          el.productId = 457;
        }
        return el;
      });

      // console.log(selectedpro);
      component.selectedProductsdata = selectedpro;
      fixture.detectChanges();
      component.openQuantityDialog(new Event('click'));

      fixture.whenStable().then(() => {
        expect(matBottomSheetSpy.open).toHaveBeenCalledWith(
          jasmine.any(Function),
          {
            data: { mobileView: component.isMobileView },
          }
        );
        expect(component.product.productDetails.quantity).toBe(2);
        expect(component.price).toEqual(component.product.price * 2);
        expect(component.discount).toEqual(component.product.discount * 2);
        expect(component.mrp).toEqual(component.product.mrp * 2);
        expect(component.selectedProducts.emit).toHaveBeenCalledWith(
          component.selectedProductsdata
        );
      });
    }));
    it('should open quantity dialog in a mobile view if checkBoxValue is false should not emit data from selectedData', waitForAsync(() => {
      component.isMobileView = true;
      component.checkBoxValue = false;
      spyOn(component.selectedProducts, 'emit');
      const bottomSheetRefSpyObj = jasmine.createSpyObj({
        afterDismissed: of(2),
      });
      matBottomSheetSpy.open.and.returnValue(bottomSheetRefSpyObj);
      let selectedpro = [...pricingDetails.selectedProducts].map((el, i) => {
        if (i == 0) {
          el.productId = 1052;
        } else {
          el.productId = 457;
        }
        return el;
      });

      // console.log(selectedpro);
      component.selectedProductsdata = selectedpro;
      fixture.detectChanges();
      component.openQuantityDialog(new Event('click'));

      fixture.whenStable().then(() => {
        expect(matBottomSheetSpy.open).toHaveBeenCalledWith(
          jasmine.any(Function),
          {
            data: { mobileView: component.isMobileView },
          }
        );
        expect(component.product.productDetails.quantity).toBe(2);
        expect(component.price).toEqual(component.product.price * 2);
        expect(component.discount).toEqual(component.product.discount * 2);
        expect(component.mrp).toEqual(component.product.mrp * 2);
        expect(component.selectedProducts.emit).not.toHaveBeenCalledWith(
          component.selectedProductsdata
        );
      });
    }));
  });

  describe('opendeleteDialog', () => {
    it('should open delete dialog on mobile view is false and set selected products', () => {
      component.isMobileView = false;

      spyOn(component.selectedProducts, 'emit');
      const dialogRefSpyObj = jasmine.createSpyObj({
        afterClosed: of([]),
      });
      matDialogSpy.open.and.returnValue(dialogRefSpyObj);
      let deleteData = {
        header: 'Move From Bag',
        description: 'Are you sure you want to move this item from bag?',
        btntext: 'REMOVE',
        deleteid: 1052,
        wishlidids: [{ productId: 1052 }],
        single: true,
        imageurl:
          'http://assets.myntassets.com/assets/images/10673544/2019/9/24/6b9c7688-7ca2-4d11-9e5b-a3745ecd8f761569310358973-The-Indian-Garage-Co-Men-Shirts-8481569310357131-1.jpg',
        mobileView: false,
      };
      component.deleteDialogData = deleteData;
      component.opendeleteDialog(1, new Event('click'));

      expect(matDialogSpy.open).toHaveBeenCalledWith(
        DeleteAlertDialogComponent,
        {
          data: deleteData,
          position: { top: '150px' },
        }
      );

      expect(component.selectedProductsdata).toEqual([]);
      expect(component.selectedProducts.emit).toHaveBeenCalledWith([]);
    });
  });

  it('should open delete bottomSheet on mobile view is true and set selected products', () => {
    component.isMobileView = true;

    spyOn(component.selectedProducts, 'emit');
    const bottomSheetRefSpyObj = jasmine.createSpyObj({
      afterDismissed: of([]),
    });
    matBottomSheetSpy.open.and.returnValue(bottomSheetRefSpyObj);
    let deleteData = {
      header: 'Move From Bag',
      description: 'Are you sure you want to move this item from bag?',
      btntext: 'REMOVE',
      deleteid: 1052,
      wishlidids: [{ productId: 1052 }],
      single: true,
      imageurl:
        'http://assets.myntassets.com/assets/images/10673544/2019/9/24/6b9c7688-7ca2-4d11-9e5b-a3745ecd8f761569310358973-The-Indian-Garage-Co-Men-Shirts-8481569310357131-1.jpg',
      mobileView: true,
    };
    component.deleteDialogData = deleteData;
    component.opendeleteDialog(1, new Event('click'));

    expect(matBottomSheetSpy.open).toHaveBeenCalledWith(jasmine.any(Function), {
      data: deleteData,
    });

    expect(component.selectedProductsdata).toEqual([]);
    expect(component.selectedProducts.emit).toHaveBeenCalledWith([]);
  });
  describe('onChangeEvent_CheckBox', () => {
    it('should handle checkbox checked event', () => {
      const event = { checked: true };
      spyOn(component.selectedProducts, 'emit');
      const id = 1;
      component.selectedProductsdata = [];
      spyOn(component, 'setDeliveryDate');

      component.onChangeEvent_CheckBox(event, id);

      expect(component.checkBoxValue).toBe(true);
      expect(component.setDeliveryDate).toHaveBeenCalled();
      expect(component.selectedProductsdata).toEqual([
        {
          productId: id,
          mrp: component.mrp,
          price: component.price,
          discount: component.discount,
          size: component.product.productDetails.size,
          quantity: component.product.productDetails.quantity,
          deliveryDate: component.productDeliveryDate,
          productImage: component.product.productimage,
        },
      ]);
      expect(component.selectedProducts.emit).toHaveBeenCalledWith(
        component.selectedProductsdata
      );
    });

    it('should handle checkbox unchecked event', () => {
      const event = { checked: false };
      const id = 1;
      spyOn(component.selectedProducts, 'emit');
      spyOn(component, 'setDeliveryDate');
      (component.selectedProductsdata = [
        {
          productId: id,
          mrp: component.mrp,
          price: component.price,
          discount: component.discount,
          size: component.product.productDetails.size,
          quantity: component.product.productDetails.quantity,
          deliveryDate: component.productDeliveryDate,
          productImage: component.product.productimage,
        },
      ]),
        component.onChangeEvent_CheckBox(event, id);

      expect(component.checkBoxValue).toBe(false);
      expect(component.setDeliveryDate).not.toHaveBeenCalled();
      expect(component.selectedProductsdata).toEqual([]);
      expect(component.selectedProducts.emit).toHaveBeenCalledWith(
        component.selectedProductsdata
      );
    });
  });

  describe('setDeliveryDate', () => {
    it('should set correct delivery date for feb month', () => {
      let date = new Date(2024, 1, 26);
      component.setDeliveryDate(date);

      expect(component.productDeliveryDate).toEqual('2 Mar 2024');
      expect(component.product.deliveyDate).toEqual('2 Mar 2024');
    });
    it('should set correct delivery date for odd months', () => {
      let date = new Date(2024, 4, 29);
      component.setDeliveryDate(date);

      expect(component.productDeliveryDate).toEqual('2 Jun 2024');
      expect(component.product.deliveyDate).toEqual('2 Jun 2024');
    });
    it('should set correct delivery date for even months', () => {
      let date = new Date(2024, 3, 29);
      component.setDeliveryDate(date);

      expect(component.productDeliveryDate).toEqual('3 May 2024');
      expect(component.product.deliveyDate).toEqual('3 May 2024');
    });

    it('should set correct delivery date for dec month', () => {
      let date = new Date(2024, 11, 29);
      component.setDeliveryDate(date);

      expect(component.productDeliveryDate).toEqual('2 Jan 2025');
      expect(component.product.deliveyDate).toEqual('2 Jan 2025');
    });
    it('should set correct delivery date for normal dates', () => {
      let date = new Date(2024, 10, 15);
      component.setDeliveryDate(date);

      expect(component.productDeliveryDate).toEqual('19 Nov 2024');
      expect(component.product.deliveyDate).toEqual('19 Nov 2024');
    });
  
  });
});
