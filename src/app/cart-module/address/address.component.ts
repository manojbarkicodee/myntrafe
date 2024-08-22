import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { CartService } from 'src/app/services/cart/cart.service';
import { address, pricingDetails, selectedProducts } from '../model';
import { MatDialog } from '@angular/material/dialog';
import { AddressformComponent } from 'src/app/shared/matdialogs/addressform/addressform.component';
import { MatRadioButton } from '@angular/material/radio';
import { concatMap } from 'rxjs';
import { MatStep, MatStepper } from '@angular/material/stepper';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.scss'],
})
export class AddressComponent implements OnInit, AfterViewInit {
  pricingDetails: pricingDetails = {
    totalAmount: 0,
    totalMrp: 0,
    estimatedDeliveryDate: '',
    discountOnMrp: 0,
  };
  @ViewChildren('matCheckRadio') radioBtn!: QueryList<MatRadioButton>;
  defaultAddress!: address;
  otherAddresses!: address[];
  selectedProductsCount: number = 0;
  formDefaultValues!: address;
  checkAddresses!: boolean;
  @Input() stepper!: MatStepper;
  @Input() step!: MatStep;
  @ViewChild('otherAddress') otherAddress!: ElementRef;
  addressScrollElement!: HTMLDivElement;
  @ViewChild('deliveryProducts') deliveryProducts!: ElementRef;
  deliveryProductsScrollElement!: HTMLDivElement;
  addressSelected: boolean = false;
  horizontalPosition: MatSnackBarHorizontalPosition = 'right';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  productsToDelivery!: selectedProducts[];
  @Input() isMobileView!:boolean
  constructor(
    private cartservice: CartService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}
  ngOnInit(): void {
    this.cartservice.pricingDetails.subscribe((data) => {
      console.log(data)
      this.pricingDetails = data;
      if (this.pricingDetails?.selectedProducts) {
        this.productsToDelivery = this.pricingDetails.selectedProducts;
        this.selectedProductsCount =
          this.pricingDetails?.selectedProducts?.length;
        this.setScrollTo(
          5,
          this.deliveryProductsScrollElement,
          this.productsToDelivery.length
        );
      }
    });

    this.cartservice.getMethod_toGetAddresses().subscribe((data) => {
      this.cartservice.addressess.next(data);
    });

    this.cartservice.addressess.subscribe((addresses) => {
      if (addresses.length === 0) {
        this.checkAddresses = false;
      } else {
        if (
          addresses.filter((address) => {
            return !address.deleted;
          }).length === 0
        ) {
          this.checkAddresses = false;
        } else {
          this.checkAddresses = true;
        }
      }
      this.toGetaddresses(
        addresses.filter((address) => {
          return !address.deleted;
        })
      );
      if (this.addressScrollElement) {
        this.setScrollTo(
          2,
          this.addressScrollElement,
          this.otherAddresses.length
        );
      }
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      if(this.otherAddress){
        this.addressScrollElement = this.otherAddress
        .nativeElement as HTMLDivElement;
        this.setScrollTo(
          2,
          this.addressScrollElement,
          this.otherAddresses.length
        );
      }
      if(this.deliveryProducts){
        this.deliveryProductsScrollElement = this.deliveryProducts
        .nativeElement as HTMLDivElement;
      }

  
    }, 500);
  }

  setScrollTo(
    length: number,
    element: HTMLDivElement,
    conditionLength: number
  ) {
    if (conditionLength > length) {
      element.classList.add('toScroll');
    } else {
      element.classList.remove('toScroll');
    }
  }

  openSnackBar(message: string, action: string, panelClass: string) {
    this.snackBar.open(message, action, {
      duration: 1000,
      verticalPosition: this.verticalPosition,
      horizontalPosition: this.horizontalPosition,
      panelClass: [panelClass],
    });
  }

  showAlert(message: string, panelClass: string) {
    this.openSnackBar(message, '', panelClass);
  }

  toGetaddresses(data: address[]) {
    this.defaultAddress = data.filter((address) => {
      return address.default;
    })[0];
    this.otherAddresses = data.filter((address) => {
      return !address.default;
    });
  }

  selectAddressMethod(
    radiobtn: MatRadioButton,
    element: HTMLDivElement,
    id: number
  ) {
    radiobtn.checked = true;
    this.addressSelected = true;

    if (id === this.defaultAddress?.id) {
      this.cartservice.selectedAddress = this.defaultAddress;
    } else {
      let selectedAddress = this.otherAddresses.find((address) => {
        return address.id === id;
      });
      if (selectedAddress) {
        this.cartservice.selectedAddress = selectedAddress;
      }
    }
    let elements = document.querySelectorAll('.showOnChecked');
    Array.from(elements).map((el) => {
      el.classList.add('displaynone');
      el.classList.remove('showElement');
    });
    if (radiobtn.checked) {
      element.classList.remove('displaynone');
      element.classList.add('showElement');
    }
  }

  deleteAddressMethod(id: number) {
    this.cartservice
      .deleteMethod_toDeleteAddress(id)
      .pipe(
        concatMap((el) => {
          return this.cartservice.getMethod_toGetAddresses();
        })
      )
      .subscribe((data) => {
        this.cartservice.addressess.next(data.filter((address) => {
          return !address.deleted;
        }));
      });
  }

  openFormDialog(mode: boolean) {
    if (!mode) {
      this.formDefaultValues = {
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
    }

    let config=this.isMobileView?{
      width: '100vw',
      height: '100vh',
      position: { top: '0px' },
      maxWidth:'100vw'
    }:{
      width: '450px',
      height: '500px',
      position: { top: '10px' },
    }
    let dialog = this.dialog.open(AddressformComponent, {
    ...config,
      data: { defaultValues: this.formDefaultValues, editMode: mode },
    });
    dialog.afterClosed();
  }

  editAddresFormDetails(address: address, mode: boolean) {
    this.formDefaultValues = address;
    this.openFormDialog(mode);
  }

  moveToNextMatStep() {
    this.step.completed = true;
    if (!this.addressSelected) {
      this.showAlert('Select a address to continue', 'warn');
    } else {
      this.stepper.next();
    }
  }
}
