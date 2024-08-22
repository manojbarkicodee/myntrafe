import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';

import { AddressesComponent } from './addresses.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SharedModule } from 'src/app/shared/shared.module';
import { CartService } from 'src/app/services/cart/cart.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject, of } from 'rxjs';
import { addresses } from 'src/app/testing/mockData';
import { address } from 'src/app/cart-module/model';
import { AddressformComponent } from 'src/app/shared/matdialogs/addressform/addressform.component';

describe('AddressesComponent', () => {
  let component: AddressesComponent;
  let fixture: ComponentFixture<AddressesComponent>;
  let cartServiceSpy: jasmine.SpyObj<CartService>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>;
  beforeEach(async () => {
    cartServiceSpy = jasmine.createSpyObj('CartService', [
      'getMethod_toGetAddresses',
      'deleteMethod_toDeleteAddress',
    ]);
    dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);
    cartServiceSpy.addressess = new Subject();
    await TestBed.configureTestingModule({
      declarations: [AddressesComponent],
      imports: [HttpClientTestingModule, SharedModule],
      providers: [
        { provide: CartService, useValue: cartServiceSpy },
        { provide: MatDialog, useValue: dialogSpy },
        { provide: MatSnackBar, useValue: snackBarSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AddressesComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should call checkScreenWidth and getMethod_toGetAddresses on ngOnInit', fakeAsync(() => {
      spyOn(component, 'checkScreenWidth');
      spyOn(cartServiceSpy.addressess, 'next');
      cartServiceSpy.getMethod_toGetAddresses.and.returnValue(of(addresses));

      component.ngOnInit();
      tick();

      expect(component.checkScreenWidth).toHaveBeenCalled();
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
      console.log(addresses);
      component.ngOnInit();
      tick(); // Waiting for observable to complete
      cartServiceSpy.addressess.next(addresses);
      expect(component.checkAddresses).toBeTrue();
    }));

    it('should call toGetaddresses when addresses are received', fakeAsync(() => {
      cartServiceSpy.getMethod_toGetAddresses.and.returnValue(of(addresses));
      console.log(addresses);
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
        3,
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

  describe('onResize', () => {
    it('should call checkScreenWidth on window resize', () => {
      spyOn(component, 'checkScreenWidth');

      window.dispatchEvent(new Event('resize'));

      expect(component.checkScreenWidth).toHaveBeenCalled();
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

  describe('ngAfterViewInit', () => {
    it('should call setScrollTo with correct parameters when otherAddress exists', fakeAsync(() => {
      spyOn(component, 'setScrollTo');
      component.otherAddresses = addresses;
      component.otherAddress = { nativeElement: document.createElement('div') };

      component.ngAfterViewInit();
      tick(500);

      expect(component.setScrollTo).toHaveBeenCalledWith(
        3,
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
  describe('selectAddressMethod', () => {
    it('should set selectedAddress when id matches defaultAddress.id', () => {
      component.defaultAddress = addresses[1];
      component.otherAddresses = [addresses[0]];
      let element = document.createElement('div');
      component.selectAddressMethod(10, element);

      expect(cartServiceSpy.selectedAddress).toEqual(addresses[1]);
    });

    it('should set selectedAddress when id matches otherAddress.id', () => {
      component.defaultAddress = addresses[1];
      component.otherAddresses = [addresses[0]];
      let element = document.createElement('div');
      component.selectAddressMethod(9, element);
      expect(component.addressSelected).toBe(true);
      expect(cartServiceSpy.selectedAddress).toEqual(addresses[0]);
    });
    it('should update element classes when element is provided', () => {
      component.defaultAddress = addresses[1];
      component.otherAddresses = [addresses[0]];
      let element = document.createElement('div');
      spyOn(element.classList, 'add');
      spyOn(element.classList, 'remove');
      component.selectAddressMethod(9, element);
      expect(element.classList.add).toHaveBeenCalledWith('showElement');
      expect(element.classList.remove).toHaveBeenCalledWith('displaynone');
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
});
