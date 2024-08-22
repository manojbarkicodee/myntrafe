import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';

import { AddressComponent } from './address.component';
import { CartService } from 'src/app/services/cart/cart.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject, of } from 'rxjs';
import { addresses, pricingDetails } from 'src/app/testing/mockData';
import { address } from '../model';
import { AddressformComponent } from 'src/app/shared/matdialogs/addressform/addressform.component';
import { MatStep, MatStepper } from '@angular/material/stepper';

describe('AddressComponent', () => {
  let component: AddressComponent;
  let fixture: ComponentFixture<AddressComponent>;
  let cartServiceSpy: jasmine.SpyObj<CartService>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>;
  let matStepperMock: jasmine.SpyObj<MatStepper>;
  let matStepMock: jasmine.SpyObj<MatStep>;
  beforeEach(async () => {
    cartServiceSpy = await jasmine.createSpyObj('CartService', [
      'getMethod_GetCartProducts',
      'pricingDetails',
      'getMethod_toGetAddresses',
      'deleteMethod_toDeleteAddress'
    ]);
    dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);
    matStepperMock = jasmine.createSpyObj('MatStepper', ['next']);
    matStepMock = jasmine.createSpyObj('MatStep', ['completed']);
    cartServiceSpy.addressess = new Subject();
    cartServiceSpy.pricingDetails = new Subject();
    await TestBed.configureTestingModule({
      declarations: [AddressComponent],
      providers: [{ provide: MatStepper, useValue: matStepperMock },
        { provide: MatStep, useValue: matStepMock },
        { provide: CartService, useValue: cartServiceSpy },
        { provide: MatDialog, useValue: dialogSpy },
        { provide: MatSnackBar, useValue: snackBarSpy },
      ],
      imports: [SharedModule],
    }).compileComponents();

    fixture = TestBed.createComponent(AddressComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should call pricingDetails subject and se productsToDelivery and selectedProductsCount and call setScrollTo if selectedProducts', fakeAsync(() => {
      spyOn(component,'setScrollTo')
      component.deliveryProductsScrollElement=document.createElement('div')

      cartServiceSpy.getMethod_toGetAddresses.and.returnValue(of(addresses));

      component.ngOnInit();
      cartServiceSpy.pricingDetails.next(pricingDetails);

      tick()
      expect(component.pricingDetails).toEqual(pricingDetails)
      expect(component.productsToDelivery).toEqual(pricingDetails.selectedProducts)
      expect(component.selectedProductsCount).toEqual(pricingDetails.selectedProducts.length)
      expect(component.setScrollTo).toHaveBeenCalledWith(5,component.deliveryProductsScrollElement,component.productsToDelivery.length)
    }));
    
    it('should call checkScreenWidth and getMethod_toGetAddresses on ngOnInit', fakeAsync(() => {
      spyOn(cartServiceSpy.addressess, 'next');
      cartServiceSpy.getMethod_toGetAddresses.and.returnValue(of(addresses));

      component.ngOnInit();
      tick();

      expect(cartServiceSpy.getMethod_toGetAddresses).toHaveBeenCalled();
      expect(cartServiceSpy.addressess.next).toHaveBeenCalledWith(addresses);
    }));
    it('should set checkAddresses to false when addresses array is empty', fakeAsync(() => {
      cartServiceSpy.getMethod_toGetAddresses.and.returnValue(of([]));

      component.ngOnInit();
      tick();
      cartServiceSpy.addressess.next([]);

      expect(component.checkAddresses).toBeFalse();
    }));

    it('should set checkAddresses to false when all addresses are deleted', fakeAsync(() => {
      let addresss = [...addresses];
      let newAddresses = addresss.map((el) => {
        return { ...el };
      });

      newAddresses[1].deleted = true;
      cartServiceSpy.getMethod_toGetAddresses.and.returnValue(of(newAddresses));

      component.ngOnInit();

      tick(); // Waiting for observable to complete
      cartServiceSpy.addressess.next(newAddresses);

      expect(component.checkAddresses).toBeFalse();
    }));

    it('should set checkAddresses to true when at least one address is not deleted', fakeAsync(() => {
      cartServiceSpy.getMethod_toGetAddresses.and.returnValue(of(addresses));
      component.ngOnInit();
      tick(); // Waiting for observable to complete
      cartServiceSpy.addressess.next(addresses);
      expect(component.checkAddresses).toBeTrue();
    }));

    it('should call toGetaddresses when addresses are received', fakeAsync(() => {
      cartServiceSpy.getMethod_toGetAddresses.and.returnValue(of(addresses));
      spyOn(component, 'toGetaddresses');

      component.ngOnInit();
      tick(); // Waiting for observable to complete
      cartServiceSpy.addressess.next(addresses);
      expect(component.toGetaddresses).toHaveBeenCalledWith([addresses[1]]);
    }));

    it('should call setScrollTo when addressScrollElement exists', fakeAsync(() => {
      let div = document.createElement('div');
      component.addressScrollElement = div as HTMLDivElement;
      let other = [...addresses];
      let newOthers = other.map((el) => {
        return { ...el };
      });

      newOthers[1].default = false;
      component.otherAddresses = [newOthers[1]];
      cartServiceSpy.getMethod_toGetAddresses.and.returnValue(of(addresses));
      spyOn(component, 'toGetaddresses');
      spyOn(component, 'setScrollTo');
      component.ngOnInit();
      cartServiceSpy.addressess.next(addresses);
      expect(component.setScrollTo).toHaveBeenCalledWith(
        2,
        component.addressScrollElement,
        1
      );
    }));

    it('should not call setScrollTo when addressScrollElement does not exist', fakeAsync(() => {
      let other = [...addresses];
      let newOthers = other.map((el) => {
        return { ...el };
      });

      newOthers[1].default = false;
      component.otherAddresses = [newOthers[1]];
      cartServiceSpy.getMethod_toGetAddresses.and.returnValue(of(addresses));
      spyOn(component, 'toGetaddresses');
      spyOn(component, 'setScrollTo');
      component.ngOnInit();
      cartServiceSpy.addressess.next(addresses);
      expect(component.setScrollTo).not.toHaveBeenCalled();
    }));
  });

  describe('ngAfterViewInit', () => {
    it('should call setScrollTo with correct parameters when otherAddress exists', fakeAsync(() => {
      spyOn(component, 'setScrollTo');
      component.otherAddresses = addresses;
      component.otherAddress = { nativeElement: document.createElement('div') };

      component.ngAfterViewInit();
      tick(500);

      expect(component.setScrollTo).toHaveBeenCalledWith(
        2,
        component.addressScrollElement,
        2
      );
    }));

    it('should not call setScrollTo when otherAddress does not exist', fakeAsync(() => {
      spyOn(component, 'setScrollTo');

      component.ngAfterViewInit();
      tick(500);
      expect(component.setScrollTo).not.toHaveBeenCalled();
    }));

    it('should set deliveryProductsScrollElement when deliveryProducts exists', fakeAsync(() => {
      component.deliveryProducts = {
        nativeElement: document.createElement('div'),
      };

      component.ngAfterViewInit();
      tick(500);

      expect(component.deliveryProductsScrollElement).toBeDefined();
    }));

    it('should not set deliveryProductsScrollElement when deliveryProducts does not exist', fakeAsync(() => {
      component.ngAfterViewInit();
      tick(500);

      expect(component.deliveryProductsScrollElement).toBeUndefined();
    }));
  });
  describe('setScrollTo', () => {
    it('should add "toScroll" class when conditionLength is greater than length', () => {
      const element: HTMLDivElement = document.createElement('div');
      const length = 2;
      const conditionLength = 3;

      component.setScrollTo(length, element, conditionLength);

      expect(element.classList.contains('toScroll')).toBeTruthy();
    });

    it('should remove "toScroll" class when conditionLength is not greater than length', () => {
      const element: HTMLDivElement = document.createElement('div');
      const length = 3;
      const conditionLength = 2;

      element.classList.add('toScroll');

      component.setScrollTo(length, element, conditionLength);

      expect(element.classList.contains('toScroll')).toBeFalsy();
    });

    it('should not add "toScroll" class when conditionLength is equal to length', () => {
      const element: HTMLDivElement = document.createElement('div');
      const length = 2;
      const conditionLength = 2;

      component.setScrollTo(length, element, conditionLength);

      expect(element.classList.contains('toScroll')).toBeFalsy();
    });
  });

  describe('openSnackBar', () => {
    it('should open snackbar with provided message, action, and panelClass', () => {
      const message = 'Test Message';
      const action = 'Test Action';
      const panelClass = 'test-panel-class';

      component.openSnackBar(message, action, panelClass);

      expect(snackBarSpy.open).toHaveBeenCalledWith(message, action, {
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

  describe('toGetaddresses', () => {
    it('should set defaultAddress and otherAddresses based on input data', () => {
      component.toGetaddresses(addresses);

      expect(component.defaultAddress).toEqual(
        addresses.filter((a) => a.default)[0]
      );
      expect(component.otherAddresses).toEqual(
        addresses.filter((a) => !a.default)
      );
    });

    it('should handle empty data array', () => {
      const testData: address[] = [];

      component.toGetaddresses(testData);

      expect(component.defaultAddress).toBeUndefined();
      expect(component.otherAddresses).toEqual([]);
    });
  });

  describe('deleteAddressMethod', () => {
    it('should call deleteMethod_toDeleteAddress and update addressess', () => {
      cartServiceSpy.deleteMethod_toDeleteAddress.and.returnValue(
        of(addresses)
      );
      cartServiceSpy.getMethod_toGetAddresses.and.returnValue(of(addresses));
      spyOn(cartServiceSpy.addressess, 'next');
      component.deleteAddressMethod(1);

      expect(cartServiceSpy.deleteMethod_toDeleteAddress).toHaveBeenCalledWith(
        1
      );
      expect(cartServiceSpy.getMethod_toGetAddresses).toHaveBeenCalled();
      expect(cartServiceSpy.addressess.next).toHaveBeenCalledWith([
        addresses[1],
      ]);
    });
  });

  describe('openFormDialog', () => {
    it('should open AddressformComponent with correct configuration for editMode', () => {
      const config = {
        width: '450px',
        height: '500px',
        position: { top: '10px' },
      };
      const defaultValues = {
        name: 'test',
        id: 0,
        address: 'test234',
        phoneNumber: '123456',
        pincode: '34567',
        state: 'karnataka',
        locality: 'haveri',
        district: 'haveri',
        belongsTo: 'home',
        default: false,
      };
      component.formDefaultValues = defaultValues;
      dialogSpy.open.and.returnValue({ afterClosed: () => of('') } as any);

      component.openFormDialog(true);

      expect(dialogSpy.open).toHaveBeenCalledWith(AddressformComponent, {
        ...config,
        data: { defaultValues, editMode: true },
      });
    });
    it('should open AddressformComponent with correct configuration for !editMode', () => {
      const config = {
        width: '450px',
        height: '500px',
        position: { top: '10px' },
      };
      const defaultValues = {
        name: '',
        id: 0,
        address: '',
        phoneNumber: '',
        pincode: '',
        state: '',
        locality: '',
        district: '',
        belongsTo: 'home',
        default: false,
      };

      dialogSpy.open.and.returnValue({ afterClosed: () => of('') } as any);

      component.openFormDialog(false);

      expect(dialogSpy.open).toHaveBeenCalledWith(AddressformComponent, {
        ...config,
        data: { defaultValues, editMode: false },
      });
    });

    it('should call with correct configuration for mobile View', () => {
      let config = {
        width: '100vw',
        height: '100vh',
        position: { top: '0px' },
        maxWidth: '100vw',
      };
      component.isMobileView = true;
      const defaultValues = {
        name: '',
        id: 0,
        address: '',
        phoneNumber: '',
        pincode: '',
        state: '',
        locality: '',
        district: '',
        belongsTo: 'home',
        default: false,
      };
      dialogSpy.open.and.returnValue({ afterClosed: () => of('') } as any);

      component.openFormDialog(false);

      expect(dialogSpy.open).toHaveBeenCalledWith(AddressformComponent, {
        ...config,
        data: { defaultValues, editMode: false },
      });
    });
  });

  describe('editAddresFormDetails', () => {
    it('should call openFormDialog and set formDefaultValues', () => {
      spyOn(component, 'openFormDialog');

      component.editAddresFormDetails(addresses[1], false);
      expect(component.formDefaultValues).toEqual(addresses[1]);
      expect(component.openFormDialog).toHaveBeenCalledWith(false);
    });
  });

  describe('selectAddressMethod', () => {
    it('should set selectedAddress when id matches defaultAddress.id', () => {
      component.defaultAddress = addresses[1];
      component.otherAddresses = [addresses[0]];
      let element = document.createElement('div');
      const mockRadioButton = jasmine.createSpyObj('MatRadioButton', ['checked']);
      mockRadioButton.checked = false;
      component.selectAddressMethod(mockRadioButton, element,10);

      expect(cartServiceSpy.selectedAddress).toEqual(addresses[1]);
    });

    it('should set selectedAddress when id matches otherAddress.id', () => {
      component.defaultAddress = addresses[1];
      component.otherAddresses = [addresses[0]];
      let element = document.createElement('div');
      const mockRadioButton = jasmine.createSpyObj('MatRadioButton', ['checked']);
      mockRadioButton.checked = false;
      component.selectAddressMethod(mockRadioButton, element,9);
      expect(component.addressSelected).toBe(true);
      expect(cartServiceSpy.selectedAddress).toEqual(addresses[0]);
    });
    it('should update element classes when element is provided', () => {
      component.defaultAddress = addresses[1];
      component.otherAddresses = [addresses[0]];
      let element = document.createElement('div');
      spyOn(element.classList, 'add');
      spyOn(element.classList, 'remove');
      const mockRadioButton = jasmine.createSpyObj('MatRadioButton', ['checked']);
      mockRadioButton.checked = false;
      component.selectAddressMethod(mockRadioButton, element,9);
      expect(element.classList.add).toHaveBeenCalledWith('showElement');
      expect(element.classList.remove).toHaveBeenCalledWith('displaynone');
    });
  });

  describe('moveToNextMatStep',()=>{
    it('should show alert if no address is selected', fakeAsync(() => {
      spyOn(component,'showAlert')
      component.step=matStepMock
      component.stepper=matStepperMock
      component.addressSelected = false;

      component.moveToNextMatStep();
      tick();
  
      expect(component.showAlert).toHaveBeenCalledWith('Select a address to continue', 'warn');
      expect(matStepperMock.next).not.toHaveBeenCalled();
    }));
  
    it('should move to the next step if an address is selected', fakeAsync(() => {
      component.step=matStepMock
      component.stepper=matStepperMock
      component.addressSelected = true;
  
      component.moveToNextMatStep();
      tick();
  
      expect(snackBarSpy.open).not.toHaveBeenCalled();
      expect(matStepperMock.next).toHaveBeenCalled();
    }));
  
  })
});
