import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-quantitylist',
  templateUrl: './quantitylist.component.html',
  styleUrls: ['./quantitylist.component.scss'],
})
export class QuantitylistComponent implements OnInit {
  quantities: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  quantity!: number;
  quantityElement!: HTMLDivElement;
  constructor(@Optional()public dialogRef: MatDialogRef<QuantitylistComponent>, @Optional() @Inject(MAT_DIALOG_DATA) public data:{mobileView:boolean}, @Optional()
  private _bottomSheetRef: MatBottomSheetRef<QuantitylistComponent>, @Optional()@Inject(MAT_BOTTOM_SHEET_DATA)
  public mobileData:{mobileView:boolean}) {}

  ngOnInit(): void {
    if(!this.data){
      this.data=this.mobileData
    }
  }

  onNoClick(flag: boolean): void {
    if (flag) {
     this.data.mobileView?this._bottomSheetRef.dismiss(this.quantity): this.dialogRef.close(this.quantity);
    }else{
      this.data.mobileView?this._bottomSheetRef.dismiss(): this.dialogRef.close()
    }
  }

  selectQuantity(quantity: number, quantityElement: HTMLDivElement) {
    this.quantity = quantity;
    quantityElement.classList.add('onSelect');
    if (
      this.quantityElement &&
      this.quantityElement.innerText !== quantityElement.innerText
    ) {
      this.quantityElement.classList.remove('onSelect');
    }
    this.quantityElement = quantityElement;
  }
}
