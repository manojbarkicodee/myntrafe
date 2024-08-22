import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { QuantitylistComponent } from 'src/app/shared/matdialogs/quantitylist/quantitylist.component';
import { SizelistComponent } from 'src/app/shared/matdialogs/sizelist/sizelist.component';
import { alertDynamicData, cartProducts, selectedProducts } from '../../model';
import { CartService } from 'src/app/services/cart/cart.service';
import { DeleteAlertDialogComponent } from 'src/app/shared/matdialogs/delete-alert-dialog/delete-alert-dialog.component';
import { MatBottomSheet } from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
})
export class ProductComponent implements OnInit, OnChanges {
  price!: number;
  mrp!: number;
  discount!: number;
  @Input() product!: cartProducts;
  @Input() checkedAll!: boolean;
  @Input() isMobileView!:boolean
  deleteDialogData!: alertDynamicData;
  checkBoxValue: boolean = false;
  @Output() selectedProducts: EventEmitter<any> = new EventEmitter();
  @Input() selectedProductsdata!: selectedProducts[];
  productDeliveryDate!: string;
  constructor(public dialog: MatDialog, private _bottomSheet: MatBottomSheet) {}

  ngOnChanges(changes: SimpleChanges): void {
    let { checkedAll } = changes;
    if (checkedAll) {
      this.checkBoxValue = checkedAll.currentValue;
      let newDate=new Date()
      this.setDeliveryDate(newDate);
    }
  }

  ngOnInit(): void {
    this.price = this.product.price * this.product.productDetails.quantity;
    this.mrp = this.product.mrp * this.product.productDetails.quantity;
    this.discount =
      this.product.discount * this.product.productDetails.quantity;
    this.deleteDialogData = {
      header: 'Move From Bag',
      description: 'Are you sure you want to move this item from bag?',
      btntext: 'REMOVE',
      deleteid: this.product.id,
      wishlidids: [{ productId: this.product.id }],
      single: true,
      imageurl: this.product.productimage,
      mobileView:this.isMobileView
    };
  }

  openSizeDialog(event: Event, id: number): void {
    event.stopPropagation();
    if (!this.isMobileView) {
      const dialogRef = this.dialog.open(SizelistComponent, {
        data: { wishlistproduct: this.product, checkRoute: false },
      });

      dialogRef.afterClosed().subscribe((data) => {
        if (data) {
          this.product.productDetails.size = data;
          // this.size = data
          if (this.checkBoxValue) {
            let product = this.selectedProductsdata.find(
              (el) => el.productId === this.product.id
            );
            if (product) {
              product.size = this.product.productDetails.size;
              this.selectedProducts.emit(this.selectedProductsdata);
            }
          }
        }
      });
    } else {
      const dialogRef = this._bottomSheet.open(SizelistComponent, {
        data: {
          wishlistproduct: this.product,
          checkRoute: false,
          mobileView: true,
        },
      });
      dialogRef.afterDismissed().subscribe((data) => {
        if (data) {
          this.product.productDetails.size = data;
          // this.size = data
          if (this.checkBoxValue) {
            let product = this.selectedProductsdata.find(
              (el) => el.productId === this.product.id
            );
            if (product) {
              product.size = this.product.productDetails.size;
              this.selectedProducts.emit(this.selectedProductsdata);
            }
          }
        }
      });
    }

  }

  openQuantityDialog(event: Event) {
    event.stopPropagation();
    if (this.isMobileView) {
      const dialogRef = this._bottomSheet.open(QuantitylistComponent, {
        data: { mobileView: this.isMobileView },
      });
      dialogRef.afterDismissed().subscribe((data) => {
        if (data) {
          this.product.productDetails.quantity = data;

          this.price = this.product.price * data;
          this.mrp = this.product.mrp * data;
          this.discount = this.product.discount * data;
          if (this.checkBoxValue) {
            let product = this.selectedProductsdata.find(
              (el) => el.productId === this.product.id
            );
            if (product) {
              product.quantity = data;
              product.mrp = this.mrp;
              product.price = this.price;
              product.discount = this.discount;
            }
            this.selectedProducts.emit(this.selectedProductsdata);
          }
        }
      });
    } else {
      const dialogRef = this.dialog.open(QuantitylistComponent, {
        data: { mobileView: this.isMobileView },
      });
      dialogRef.afterClosed().subscribe((data) => {
        if (data) {
          this.product.productDetails.quantity = data;

          this.price = this.product.price * data;
          this.mrp = this.product.mrp * data;
          this.discount = this.product.discount * data;
          if (this.checkBoxValue) {
            let product = this.selectedProductsdata.find(
              (el) => el.productId === this.product.id
            );
            if (product) {
              product.quantity = data;
              product.mrp = this.mrp;
              product.price = this.price;
              product.discount = this.discount;
            }
            this.selectedProducts.emit(this.selectedProductsdata);
          }
        }
      });
    }
    
  }

  opendeleteDialog(id: number, event: Event) {
    event.stopPropagation();
    if (this.isMobileView) {
      const dialogRef = this._bottomSheet.open(DeleteAlertDialogComponent, {
        data: this.deleteDialogData,
      });
      dialogRef.afterDismissed().subscribe((data) => {
        if (data) {
          this.selectedProductsdata = data;
          this.selectedProducts.emit(data);
        }
      });
    } else {
      const dialogRef = this.dialog.open(DeleteAlertDialogComponent, {
        data: this.deleteDialogData,
        position: { top: '150px' },
      });
      dialogRef.afterClosed().subscribe((data) => {
        if (data) {
          this.selectedProductsdata = data;
          this.selectedProducts.emit(data);
        }
      });
    }
  
  }

  onChangeEvent_CheckBox(event: any, id: number) {
    this.checkBoxValue = event.checked;
    if (event.checked) {
      let newDate=new Date()
      this.setDeliveryDate(newDate);

      this.selectedProductsdata = [
        ...this.selectedProductsdata,
        {
          productId: id,
          mrp: this.mrp,
          price: this.price,
          discount: this.discount,
          size: this.product.productDetails.size,
          quantity: this.product.productDetails.quantity,
          deliveryDate: this.productDeliveryDate,
          productImage: this.product.productimage,
        },
      ];
    } else {
      let index = this.selectedProductsdata.findIndex(
        (el) => el.productId === id
      );
      this.selectedProductsdata.splice(index, 1);
    }
    this.selectedProducts.emit(this.selectedProductsdata);
  }

  setDeliveryDate(date:Date) {
    // let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth();
    let day = date.getDate();
    if (month === 1 && day >= 25 && day <= 28) {
      month = month + 1;
      let remainingdays = 28 - day;
      day = 4 - remainingdays;
    } else if (
      (month === 0 && day >= 28 && day <= 31) ||
      (month === 2 && day >= 28 && day <= 31) ||
      (month === 4 && day >= 28 && day <= 31) ||
      (month === 6 && day >= 28 && day <= 31) ||
      (month === 7 && day >= 28 && day <= 31) ||
      (month === 9 && day >= 28 && day <= 31)
    ) {
      month = month + 1;
      let remainingdays = 31 - day;
      day = 4 - remainingdays;
    } else if (
      (month === 3 && day >= 27 && day <= 30) ||
      (month === 5 && day >= 27 && day <= 30) ||
      (month === 8 && day >= 27 && day <= 30) ||
      (month === 10 && day >= 27 && day <= 30)
    ) {
      month = month + 1;
      let remainingdays = 30 - day;
      day = 4 - remainingdays;
    } else if (month === 11 && day >= 28 && day <= 31) {
      let remainingdays = 31 - day;
      day = 4 - remainingdays;
      month = 0;
      year = year + 1;
    } else {
      day = day + 4;
    }

    let months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    let requiredMonth = months[month] || '';

    this.productDeliveryDate = day + ' ' + requiredMonth + ' ' + year;
    this.product.deliveyDate = this.productDeliveryDate;
  }
}
