import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowShoppingDetailsDialogComponent } from './show-shopping-details-dialog.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  MAT_BOTTOM_SHEET_DATA,
  MatBottomSheetRef,
} from '@angular/material/bottom-sheet';

describe('ShowShoppingDetailsDialogComponent', () => {
  let component: ShowShoppingDetailsDialogComponent;
  let fixture: ComponentFixture<ShowShoppingDetailsDialogComponent>;
  let mockMatDialogRef: jasmine.SpyObj<
    MatDialogRef<ShowShoppingDetailsDialogComponent>
  >;
  let mockMatBottomSheetRef: jasmine.SpyObj<
    MatBottomSheetRef<ShowShoppingDetailsDialogComponent>
  >;

  beforeEach(async () => {
    mockMatDialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);
    mockMatBottomSheetRef = jasmine.createSpyObj('MatBottomSheetRef', [
      'dismiss',
    ]);
    await TestBed.configureTestingModule({
      declarations: [ShowShoppingDetailsDialogComponent],
      providers: [
        { provide: MatDialogRef, useValue: mockMatDialogRef },
        { provide: MatBottomSheetRef, useValue: mockMatBottomSheetRef },
        { provide: MAT_DIALOG_DATA, useValue: null },
        { provide: MAT_BOTTOM_SHEET_DATA, useValue: null },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ShowShoppingDetailsDialogComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should set data to mobile if not data', () => {
      component.mobileData = { products: [], mobileView: true };
      component.ngOnInit();

      expect(component.data).toEqual(component.mobileData);
    });
    it('should set products', () => {
      component.mobileData = { products: [], mobileView: true };
      component.ngOnInit();
      expect(component.products).toEqual([]);
    });
  });

  describe('onNoClick', () => {
    it('should call dismiss on mobileView true', () => {
      component.data = { products: [], mobileView: true };
      component.onNoClick();
      expect(mockMatBottomSheetRef.dismiss).toHaveBeenCalled();
    });
    it('should call close on mobileView false', () => {
      component.data = { products: [], mobileView: false };
      component.onNoClick();
      expect(mockMatDialogRef.close).toHaveBeenCalled();
    });
  });
});
