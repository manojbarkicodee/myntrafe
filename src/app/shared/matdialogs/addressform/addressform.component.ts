import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { concatMap } from 'rxjs';
import { address, editAddress } from 'src/app/cart-module/model';
import { CartService } from 'src/app/services/cart/cart.service';
import {
  checkStringOrNot,
  checkNumberOrNot,
} from '../../../validators/addressformValidators';
@Component({
  selector: 'app-addressform',
  templateUrl: './addressform.component.html',
  styleUrls: ['./addressform.component.scss'],
})
export class AddressformComponent implements OnInit {
  home: boolean = true;
  work: boolean = false;
  addressData!: address;
  addressForm!: FormGroup;
  constructor(
    private cartservice: CartService,
    private dialogRef: MatDialogRef<AddressformComponent>,
    @Inject(MAT_DIALOG_DATA) public data: editAddress
  ) {}

  ngOnInit(): void {
    this.addressForm = new FormGroup({
      name: new FormControl(this.data.defaultValues.name, [
        Validators.required,
        checkStringOrNot.bind(this),
      ]),
      phoneNumber: new FormControl(this.data.defaultValues.phoneNumber, [
        Validators.required,
        Validators.maxLength(10),
        Validators.minLength(10),
        checkNumberOrNot.bind(this),
      ]),
      pincode: new FormControl(this.data.defaultValues.pincode, [
        Validators.required,
        Validators.maxLength(6),
        Validators.minLength(6),
        checkNumberOrNot.bind(this),
      ]),
      address: new FormControl(this.data.defaultValues.address, [
        Validators.required,
      ]),
      locality: new FormControl(this.data.defaultValues.locality, [
        Validators.required,
        checkStringOrNot.bind(this),
      ]),
      district: new FormControl(this.data.defaultValues.district, [
        Validators.required,
        checkStringOrNot.bind(this),
      ]),
      state: new FormControl(this.data.defaultValues.state, [
        Validators.required,
        checkStringOrNot.bind(this),
      ]),
      belongsTo: new FormControl(this.data.defaultValues.belongsTo, [
        Validators.required,
      ]),
      default: new FormControl(this.data.defaultValues.default),
    });

    this.setBelongsTo(this.data.defaultValues.belongsTo);
  }
  onNoClick(): void {
    this.dialogRef.close();
  }

  setBelongsTo(data: string) {
    if (data === 'home') {
      this.home = true;
      this.work = false;
    } else {
      this.work = true;
      this.home = false;
    }
    this.addressForm.patchValue({
      belongsTo: data,
    });
  }

  submitAddressForm() {
    this.addressData = this.addressForm.value;

    this.addressData.phoneNumber = this.addressData.phoneNumber.toString();
    this.addressData.pincode = this.addressData.pincode.toString();

    if (!this.data.editMode) {
      this.cartservice
        .postMethod_toAddAddress(this.addressData)
        .pipe(
          concatMap((el) => {
            return this.cartservice.getMethod_toGetAddresses();
          })
        )
        .subscribe((data) => {
          this.cartservice.addressess.next(data);
        });
    } else {
      this.cartservice
        .updateMethodtoAddress(this.data.defaultValues.id, this.addressData)
        .pipe(
          concatMap((el) => {
            return this.cartservice.getMethod_toGetAddresses();
          })
        )
        .subscribe((data) => {
          this.cartservice.addressess.next(data);
        });
    }
    this.dialogRef.close();
  }
}
