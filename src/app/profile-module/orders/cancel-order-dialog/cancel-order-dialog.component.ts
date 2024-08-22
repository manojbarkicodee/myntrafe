import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { concatMap } from 'rxjs';
import { ProfileService } from 'src/app/services/profile/profile.service';

@Component({
  selector: 'app-cancel-order-dialog',
  templateUrl: './cancel-order-dialog.component.html',
  styleUrls: ['./cancel-order-dialog.component.scss'],
})
export class CancelOrderDialogComponent implements OnInit {
  reason!: string;
  reasonsToCancelOrder!: { reason: string; checked: boolean }[];
  constructor(
    @Optional()public dialogRef: MatDialogRef<CancelOrderDialogComponent>,
    @Optional()@Inject(MAT_DIALOG_DATA)
    public data: { orderId: number; productId: number,mobileView:boolean },
    @Optional()  private _bottomSheetRef: MatBottomSheetRef<CancelOrderDialogComponent>,@Optional()  @Inject(MAT_BOTTOM_SHEET_DATA) public mobileData:  { orderId: number; productId: number,mobileView:boolean },
    private orderservice: ProfileService,
    private snackBar: MatSnackBar
  ) {}

  onNoClick(): void {
    if(this.data.mobileView){
      this._bottomSheetRef.dismiss()
    }else{
      this.dialogRef.close();
    }
  }
  openSnackBar(message: string, action: string, panelClass: string) {
    this.snackBar.open(message, action, {
      duration: 1000,
      verticalPosition: 'top',
      horizontalPosition: 'right',
      panelClass: [panelClass],
    });
  }

  showAlert(message: string, panelClass: string) {
    this.openSnackBar(message, '', panelClass);
  }
  ngOnInit(): void {
    if(!this.data){
      this.data=this.mobileData
    }
    this.reasonsToCancelOrder = [
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
  }

  checkReasonToCancel(reason: string) {
    this.reason = reason;
  }

  cancelProduct() {
    if (this.reason) {
      this.orderservice
        .deleteOrderedProduct(this.data.orderId, this.data.productId)
        .pipe(
          concatMap((data) => {
           
            return this.orderservice.getOrderedDetails();
          })
        )
        .subscribe((data) => {
          this.orderservice.orderDetails.next(data);
          this.showAlert('Product deleted from ordered list', 'success');
          this.onNoClick();
        });
    } else {
      this.showAlert('Please select a reason to cancel', 'warn');
    }
  }
}

// Ordered product deleted successfuly
