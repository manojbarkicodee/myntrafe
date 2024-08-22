import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { couponsList } from 'src/app/cart-module/model';

@Component({
  selector: 'app-coupon-list',
  templateUrl: './coupon-list.component.html',
  styleUrls: ['./coupon-list.component.scss'],
})
export class CouponListComponent implements OnInit {
  availableCoupons!: couponsList[];
  totalSave: number = 0;
  lockedCoupons!: couponsList[];

  constructor(
    public dialogRef: MatDialogRef<CouponListComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      couponList: couponsList[];
      totalamount: number;
      edit: boolean;
    }
  ) {}

  ngOnInit(): void {
    if (!this.data.edit) {
      this.availableCoupons = this.data.couponList.filter((coupon) => {
        if (this.data.totalamount > coupon.minimumPurchaseAmount) {
          coupon.checked = true;
        }

        return coupon.minimumPurchaseAmount < this.data.totalamount;
      });

      this.lockedCoupons = this.data.couponList.filter((coupon) => {
        return coupon.minimumPurchaseAmount > this.data.totalamount;
      });

      this.checkTotalSave();
    } else {
      this.availableCoupons = this.data.couponList.filter((coupon) => {
        return coupon.checked;
      });
      this.checkTotalSave();
    }
  }
  onNoClick(): void {
    let appliedCoupons = this.availableCoupons.filter((coupon) => {
      return coupon.checked;
    });
    if (this.data.edit) {
      this.dialogRef.close({
        appliedCoupons: appliedCoupons,
        applied: true,
        totalSave: this.totalSave,
      });
    } else {
      this.dialogRef.close({
        appliedCoupons: [],
        applied: false,
        totalSave: 0,
      });
    }
  }

  applyCoupons() {
    let appliedCoupons = this.availableCoupons.filter((coupon) => {
      return coupon.checked;
    });
    if (this.data.edit) {
      let onchecked = this.availableCoupons.filter((coupon) => {
        return !coupon.checked;
      });

      let totalsaved = onchecked.reduce((acc, coupon) => {
        return acc + Number(coupon.saving);
      }, 0);

      if (appliedCoupons.length > 0) {
        this.dialogRef.close({
          appliedCoupons: appliedCoupons,
          applied: true,
          totalSave: -totalsaved,
        });
      } else {
        this.dialogRef.close({
          appliedCoupons: appliedCoupons,
          applied: false,
          totalSave: -totalsaved,
        });
      }
    } else {
      if (appliedCoupons.length > 0) {
        this.dialogRef.close({
          appliedCoupons: appliedCoupons,
          applied: true,
          totalSave: this.totalSave,
        });
      } else {
        this.dialogRef.close({
          appliedCoupons: appliedCoupons,
          applied: false,
          totalSave: this.totalSave,
        });
      }
    }
  }

  checkBoxChangeMethod(event: any, index: number) {
    let checkBox = this.availableCoupons[index];
    checkBox.checked = event.checked;
    this.checkTotalSave();
  }

  checkTotalSave() {
    this.totalSave = this.availableCoupons.reduce((acc, coupon) => {
      if (coupon.checked) {
        return acc + Number(coupon.saving);
      } else {
        return acc;
      }
    }, 0);
  }
}
