import { Component, HostListener, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CartService } from 'src/app/services/cart/cart.service';
import {
  alertDynamicData,
  cartProducts,
  couponsList,
  pricingDetails,
  selectedProducts,
} from '../model';
import { MatDialog } from '@angular/material/dialog';
import { DeleteAlertDialogComponent } from 'src/app/shared/matdialogs/delete-alert-dialog/delete-alert-dialog.component';
import { MatCheckbox } from '@angular/material/checkbox';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { Subscription, combineLatest } from 'rxjs';
import { MatStep, MatStepper } from '@angular/material/stepper';
import { CouponListComponent } from 'src/app/shared/matdialogs/coupon-list/coupon-list.component';
import { coupons } from '../staticData';
import { MatBottomSheet } from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-cart-bag',
  templateUrl: './cart-bag.component.html',

  styleUrls: ['./cart-bag.component.scss'],
})
export class CartBagComponent implements OnInit, OnDestroy {
  products!: cartProducts[];
  quantity: number = 1;
  url!: string;
  size!: string;
  productsCount!: number;
  totalAppliedCoupons!: number;
  totalSavedAmount!: number;
  selected: number = 0;
  couponEditMode: boolean = false;
  coupons: couponsList[] = coupons;
  @Input() stepper!: MatStepper;
  @Input() steps!: NodeList;
  @Input() step!: MatStep;
  pricingDetails: pricingDetails = {
    totalMrp: 0,
    discountOnMrp: 0,
    totalAmount: 0,
    estimatedDeliveryDate: '',
  };
  intermediate: boolean = false;
  selectAll!: boolean;
  selectedProducts: selectedProducts[] = [];
  horizontalPosition: MatSnackBarHorizontalPosition = 'right';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  @ViewChild('selectionCheckBox') maincheckbox!: MatCheckbox;
  deleteDialogData!: alertDynamicData;
  cartProductsSubsciption!: Subscription;
  dialogSubsciption!: Subscription;
  isMobileView: boolean = false;
  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    this.checkScreenWidth();
  }

  constructor(
    private cartService: CartService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    private _bottomSheet: MatBottomSheet
  ) {}

  ngOnInit(): void {
    this.checkScreenWidth()
    if (this.cartService ) {
      this.cartService.getMethod_GetCartProducts().subscribe((data) => {
        this.cartService.cartProducts.next(data[0].products);
      });
    }
   

    this.cartProductsSubsciption = this.cartService.cartProducts.subscribe(
      (data) => {
        this.products = data;
        this.productsCount = this.products.length;
        this.cartService.productsCount.next(this.products.length);
      }
    );
  }

  checkScreenWidth(): void {
    this.isMobileView = window.innerWidth <= 500; // Adjust the threshold as needed
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

  opendeleteDialog(check: boolean, event: Event) {
    event.stopPropagation();

    let deleteId: { productId: number }[] | string = [...this.selectedProducts];
    deleteId = deleteId
      .map((el) => {
        return el.productId;
      })
      .join(',');

    if (check) {
      this.deleteDialogData = {
        header: `Remove ${this.selected} item`,
        description: `Are you sure you want to remove ${this.selected} from the bag.`,
        btntext: 'REMOVE',
        single: false,
        deleteid: deleteId,
        wishlidids: this.selectedProducts.map((product) => ({
          productId: product.productId,
        })),
        mobileView:this.isMobileView
      };
    } else {
      this.deleteDialogData = {
        header: `Move ${this.selected} item to wishlist`,
        description: `Are you sure you want to move ${this.selected} from the bag.`,
        btntext: 'CANCEL',
        single: false,
        deleteid: deleteId,
        wishlidids: this.selectedProducts.map((product) => ({
          productId: product.productId,
        })),
        mobileView:this.isMobileView
      };
    }

    if (this.selected !== 0) {
      if (!this.isMobileView) {
        const dialogRef = this.dialog.open(DeleteAlertDialogComponent, {
          data: this.deleteDialogData,
        });
        dialogRef.afterClosed().subscribe((data) => {
          if (data) {
            this.selectedProducts = data;
            this.selected = data.length;
            this.setSelectedProducts(this.selectedProducts);
          }
        });
      } else {
        const dialogRef = this._bottomSheet.open(DeleteAlertDialogComponent, {
          data: this.deleteDialogData,
        });
        dialogRef.afterDismissed().subscribe((data) => {
          if (data) {
            this.selectedProducts = data;
            this.selected = data.length;
            this.setSelectedProducts(this.selectedProducts);
          }
        });
      }

    } else if (check) {
      this.showAlert('Select any item to remove from bag', 'warn');
    } else if (!check) {
      this.showAlert('Select any item to move to wishlist', 'warn');
    }
  }

  openCouponList() {
    if (this.selected === 0) {
      this.showAlert('Select any item to apply coupon', 'warn');
      return;
    }
    let config=this.isMobileView?{
      width:'100vw',
      height:'100vh',
      marginTop:'0px',
      maxWidth:'100vw',
      position:{top:'0px'}
    }:{
      width: '500px',
      height: '500px',
      position: { top: '30px' },
    }
    const dialogRef = this.dialog.open(CouponListComponent, {
     ...config,
      data: {
        couponList: this.coupons,
        totalamount: this.pricingDetails.totalAmount,
        edit: this.couponEditMode,
      },
    });

  this.dialogSubsciption=  dialogRef.afterClosed().subscribe((data) => {
      if (this.couponEditMode && this.totalSavedAmount === data.totalSave) {
        this.pricingDetails.totalAmount = this.pricingDetails.totalAmount;
      } else {
        this.pricingDetails.totalAmount =
          this.pricingDetails.totalAmount - data.totalSave;
      }
      if (data.totalSave < 0) {
        this.totalSavedAmount = this.totalSavedAmount + data.totalSave;
      } else {
        this.totalSavedAmount = data.totalSave;
      }
      this.couponEditMode = data.applied;
      if (this.couponEditMode) {
        this.coupons = data.appliedCoupons;
        this.totalAppliedCoupons = data.appliedCoupons.length;
      } else {
        this.coupons = coupons;
      }
 
    });
  }

  setSelectedProducts(event: selectedProducts[]) {
    this.selectedProducts = event;
    this.selected = event.length;
    if (this.selectedProducts.length > 0) {
      let pricing = this.setPricingDetails();
      console.log(pricing)
      this.pricingDetails = pricing;
    } else {
      this.pricingDetails = {
        totalMrp: 0,
        totalAmount: 0,
        discountOnMrp: 0,
        estimatedDeliveryDate: '',
      };
    }
    console.log(this.selected,this.productsCount)
    if (this.selected === this.productsCount) {
      this.intermediate = false;
      this.maincheckbox.checked = true;
      this.selectAll = true;
    } else if (this.selected > 0 && this.selected < this.productsCount) {
      this.intermediate = true;
    } else {
      this.intermediate = false;
      this.maincheckbox.checked = false;
      this.selectAll = false;
    }
    this.cartService.selectedProducts = event;
  }

  selectAllProducts(event: any) {
    this.selectAll = event.checked;
    this.intermediate = false;
    if (event.checked) {
      this.selectedProducts = this.products.map((product) => {
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
      let pricing = this.setPricingDetails();
      console.log(pricing)
      this.pricingDetails = pricing;
    } else {
      this.selectedProducts = [];
      this.pricingDetails = {
        totalMrp: 0,
        totalAmount: 0,
        discountOnMrp: 0,
        estimatedDeliveryDate: '',
      };
    }
    this.selected = this.selectedProducts.length;
  }

  setPricingDetails(): pricingDetails {
    let totalMrp: number = 0;
    let totalAmount: number = 0;
    let totalDiscount: number = 0;
    let estimatedDeliveryDate: string | undefined = '';
    console.log(this.selectedProducts,'============>pro')
    this.selectedProducts.forEach((product) => {
      totalMrp = totalMrp + product.mrp;
      totalAmount = totalAmount + product.price;
      totalDiscount = totalDiscount + product.discount;
      estimatedDeliveryDate = product.deliveryDate;
    });

    this.couponEditMode = false;
    this.coupons = coupons;
    return {
      totalMrp: totalMrp,
      discountOnMrp: totalDiscount,
      totalAmount: totalAmount,
      estimatedDeliveryDate: estimatedDeliveryDate,
    };
  }

  methodTonavToAddress() {
    if (this.selected === 0) {
      this.showAlert('Select atleast one item in bag to place order', 'warn');
    } else {
      this.cartService.pricingDetails.next({
        totalMrp: this.pricingDetails.totalMrp,
        discountOnMrp: this.pricingDetails.discountOnMrp,
        totalAmount: this.pricingDetails.totalAmount,
        couponDiscount: this.totalSavedAmount,
        estimatedDeliveryDate: this.pricingDetails.estimatedDeliveryDate,
        selectedProducts: this.selectedProducts,
      });

      if (!this.step.completed) {
        this.step.completed = true;
      }

      this.stepper.next();
    }
  }

  ngOnDestroy(): void {
   if(this.cartProductsSubsciption){
    this.cartProductsSubsciption.unsubscribe();
  } 

  }
}
