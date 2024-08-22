import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { editAddress, successResponse } from 'src/app/cart-module/model';
import { CartService } from 'src/app/services/cart/cart.service';
import {
  checkNumberOrNot,
  checkStringOrNot,
} from 'src/app/validators/addressformValidators';
import { checkdate } from 'src/app/validators/cardFormvalidator';

@Component({
  selector: 'app-cardform',
  templateUrl: './cardform.component.html',
  styleUrls: ['./cardform.component.scss'],
})
export class CardformComponent implements OnInit {
  cardForm!: FormGroup;
  constructor(
    private cartservice: CartService,
    private snackBar: MatSnackBar,
    @Optional() public dialogRef: MatDialogRef<CardformComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: editAddress,
    @Optional()
    private _bottomSheetRef: MatBottomSheetRef<CardformComponent>,
    @Optional()
    @Inject(MAT_BOTTOM_SHEET_DATA)
    public mobileData: editAddress
  ) {}

  ngOnInit(): void {
    if (!this.data) {
      this.data = this.mobileData;
    }
    this.cardForm = new FormGroup({
      cardnumber: new FormControl('', [
        Validators.required,
        Validators.minLength(16),
        checkNumberOrNot.bind(this),
      ]),
      name: new FormControl('', [
        Validators.required,
        checkStringOrNot.bind(this),
      ]),
      date: new FormControl('', [Validators.required, checkdate.bind(this)]),
      cvv: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        checkNumberOrNot.bind(this),
      ]),
    });
  }

  onNoClick(): void {
    if (this.data.mobileView) {
      this._bottomSheetRef.dismiss();
    } else {
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

  saveCard() {
    let formdata = this.cardForm.value;
    this.cartservice
      .postMethodToCardS(formdata)
      .subscribe({next:  (data: successResponse) => {
        if (data) {
          this.showAlert(data.message, 'success');
          this.dialogRef.close();
        }
      },error:(error)=>{
        console.log(error)
      },complete:()=>{
        this.cartservice.getMethodToCards().subscribe({
          next: (data) => {
            this.cartservice.cards.next(data);
          },
          error: (error) => {},
        });
      }}
      );
  }
}
