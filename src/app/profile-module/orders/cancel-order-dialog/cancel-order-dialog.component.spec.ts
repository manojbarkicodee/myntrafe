import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelOrderDialogComponent } from './cancel-order-dialog.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProfileService } from 'src/app/services/profile/profile.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SharedModule } from 'src/app/shared/shared.module';
import {
  MAT_BOTTOM_SHEET_DATA,
  MatBottomSheetRef,
} from '@angular/material/bottom-sheet';

describe('CancelOrderDialogComponent', () => {
  let component: CancelOrderDialogComponent;
  let fixture: ComponentFixture<CancelOrderDialogComponent>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<CancelOrderDialogComponent>>;
  let bottomRefSpy: jasmine.SpyObj<
    MatBottomSheetRef<CancelOrderDialogComponent>
  >;
  let profileServiceSpy: jasmine.SpyObj<ProfileService>;
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>;
  beforeEach(async () => {
    const dialogRefSpyObj = jasmine.createSpyObj('MatDialogRef', [
      'close',
      'dismiss',
    ]);
    const profileServiceSpyObj = jasmine.createSpyObj('ProfileService', [
      'deleteOrderedProduct',
      'getOrderedDetails',
    ]);
    const snackBarSpyObj = jasmine.createSpyObj('MatSnackBar', ['open']);
    const bottomRefSpyObj = jasmine.createSpyObj('MatBottomSheetRef', [
      'close',
      'dismiss',
    ]);
    await TestBed.configureTestingModule({
      declarations: [CancelOrderDialogComponent],
      imports: [HttpClientTestingModule, SharedModule],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefSpyObj },
        { provide: MatBottomSheetRef, useValue: bottomRefSpyObj },
        { provide: MAT_DIALOG_DATA, useValue: null },
        { provide: MAT_BOTTOM_SHEET_DATA, useValue: null }, // for testing mobileView condition
        { provide: ProfileService, useValue: profileServiceSpyObj },
        { provide: MatSnackBar, useValue: snackBarSpyObj },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CancelOrderDialogComponent);
    component = fixture.componentInstance;
    dialogRefSpy = TestBed.inject(MatDialogRef) as jasmine.SpyObj<
      MatDialogRef<CancelOrderDialogComponent>
    >;
    bottomRefSpy = TestBed.inject(MatBottomSheetRef) as jasmine.SpyObj<
      MatBottomSheetRef<CancelOrderDialogComponent>
    >;
    profileServiceSpy = TestBed.inject(
      ProfileService
    ) as jasmine.SpyObj<ProfileService>;
    snackBarSpy = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('onNoClick', () => {
    it('should close dialog onNoClick() if not in mobile view', () => {
      component.data = { orderId: 1, productId: 2, mobileView: false };
      component.onNoClick();
      expect(dialogRefSpy.close).toHaveBeenCalled();
    });

    it('should dismiss bottom sheet onNoClick() if in mobile view', () => {
      component.data = { orderId: 1, productId: 2, mobileView: true };
      component.onNoClick();
      expect(bottomRefSpy.dismiss).toHaveBeenCalled();
    });
  });
  describe('ngOnInit', () => {
    it('should set data to mobileData if data is not available and set reasonsToCancelOrder', () => {
      let reasontoOrder = [
        {
          reason: 'Incorrect size ordered',
          checked: false,
        },
        {
          reason: 'Product not required anymore',
          checked: false,
        },
        {
          reason: 'Cash Issue',
          checked: false,
        },
        {
          reason: 'Ordered By Mistake',
          checked: false,
        },
        {
          reason: 'Wants to change style/color',
          checked: false,
        },
        {
          reason: 'Delayed Delivery Cancellation',
          checked: false,
        },
        {
          reason: 'Duplicate Order',
          checked: false,
        },
      ];
      console.log(component.data);
      component.mobileData = { orderId: 1, productId: 2, mobileView: true };
      component.ngOnInit();
      expect(component.data).toEqual(component.mobileData);
      expect(component.reasonsToCancelOrder).toEqual(reasontoOrder);
    });
  });

  describe('openSnackBar', () => {
    it('should open a snack bar with the provided message, action, and panelClass', () => {
      component.openSnackBar('Test Message', 'Test Action', 'test-panel-class');

      expect(snackBarSpy.open).toHaveBeenCalledWith(
        'Test Message',
        'Test Action',
        {
          duration: 1000,
          verticalPosition: 'top',
          horizontalPosition: 'right',
          panelClass: ['test-panel-class'],
        }
      );
    });
  });

  describe('showAlert', () => {
    it('should call openSnackBar with the provided message and panelClass', () => {
      const openSnackBarSpy = spyOn(component, 'openSnackBar');

      component.showAlert('Test Message', 'test-panel-class');

      expect(openSnackBarSpy).toHaveBeenCalledWith(
        'Test Message',
        '',
        'test-panel-class'
      );
    });
  });

  describe('checkReasonToCancel', () => {
    it('should set reason on checkReasonToCancel()', () => {
      const reason = 'Incorrect size ordered';
      component.checkReasonToCancel(reason);
      expect(component.reason).toEqual(reason);
    });
  });
});
