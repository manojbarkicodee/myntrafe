import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';

import { InputAddressComponent } from './input-address.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CartService } from 'src/app/services/cart/cart.service';
import {
  FormControl,
  FormGroup,
  FormsModule,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  checkNumberOrNot,
  checkStringOrNot,
} from 'src/app/validators/addressformValidators';
import { COMPILER_OPTIONS, forwardRef } from '@angular/core';
import { Subject, of } from 'rxjs';
import { addresses } from 'src/app/testing/mockData';

describe('InputAddressComponent', () => {
  let component: InputAddressComponent;
  let fixture: ComponentFixture<InputAddressComponent>;
  let mockCartService: jasmine.SpyObj<CartService>;
  beforeEach(async () => {
    mockCartService = jasmine.createSpyObj('CartService', [
      'postMethod_toAddAddress',
      'getMethod_toGetAddresses',
    ]);
    mockCartService.addressess = new Subject();
    await TestBed.configureTestingModule({
      declarations: [InputAddressComponent],
      imports: [HttpClientTestingModule, ReactiveFormsModule, FormsModule],
      providers: [{ provide: CartService, useValue: mockCartService }],
    }).compileComponents();

    fixture = TestBed.createComponent(InputAddressComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should create from for addressForm', fakeAsync(() => {
      component.ngOnInit();
      tick();
      expect(component.addressForm).toBeDefined();
    }));
  });

  describe('setBelongsTo', () => {
    it('should set home to true and work to false on data home', () => {
      component.ngOnInit();
      component.setBelongsTo('home');
      expect(component.home).toBeTruthy();
      expect(component.work).toBeFalsy();
    });
    it('should set home to false and work to true on data work', () => {
      component.ngOnInit();
      component.setBelongsTo('work');
      expect(component.home).toBeFalsy();
      expect(component.work).toBeTruthy();
    });
  });

  describe('submitAddressForm', () => {
    it('should get formData and call postMethod_toAddAddress and getMethod_toGetAddresses', () => {
      let successResponse = {
        statusCode: 201,
        status: 'created',
        message: 'address added successfully',
      };
      component.ngOnInit()
      component.addressForm.patchValue({
        name: 'Test',
        phoneNumber: '3455667778',
        pincode: '456788',
        address: 'FGGHJ',
        locality: 'DFGGG',
        district: 'GGH',
        state: 'DDDD',
        belongsTo: 'work',
        default: false,
      })
      spyOn(mockCartService.addressess, 'next');
      mockCartService.postMethod_toAddAddress.and.returnValue(
        of(successResponse)
      );
      mockCartService.getMethod_toGetAddresses.and.returnValue(of(addresses));
      component.submitAddressForm()
      expect(component.addressData).toEqual({
        name: 'Test',
        phoneNumber: '3455667778',
        pincode: '456788',
        address: 'FGGHJ',
        locality: 'DFGGG',
        district: 'GGH',
        state: 'DDDD',
        belongsTo: 'work',
        default: false,
      });
      expect(component.addressData.phoneNumber).toEqual('3455667778')
      expect(component.addressData.pincode).toEqual('456788')
      expect(mockCartService.postMethod_toAddAddress).toHaveBeenCalled()
      expect(mockCartService.getMethod_toGetAddresses).toHaveBeenCalled()
      expect(mockCartService.addressess.next).toHaveBeenCalledWith(addresses)
    });
  });
});
