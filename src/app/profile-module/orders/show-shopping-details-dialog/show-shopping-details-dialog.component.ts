import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Product } from '../../model';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-show-shopping-details-dialog',
  templateUrl: './show-shopping-details-dialog.component.html',
  styleUrls: ['./show-shopping-details-dialog.component.scss'],
})
export class ShowShoppingDetailsDialogComponent implements OnInit {
  products!: Product[];
  constructor(
    @Optional()  public dialogRef: MatDialogRef<ShowShoppingDetailsDialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA)
    public data: any,
    @Optional()  private _bottomSheetRef: MatBottomSheetRef<ShowShoppingDetailsDialogComponent>,@Optional()  @Inject(MAT_BOTTOM_SHEET_DATA) public mobileData: any
  ) {}

  ngOnInit(): void {
    if(!this.data){
      this.data=this.mobileData
    }
    if (this.data.products) {
      this.products = this.data.products;
    }
  }

  onNoClick(): void {
    if(this.data.mobileView){
      this._bottomSheetRef.dismiss()
    }else{
      this.dialogRef.close();
    }
  }
}
