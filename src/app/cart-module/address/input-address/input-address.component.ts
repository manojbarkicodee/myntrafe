import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { concatMap } from 'rxjs';
import { CartService } from 'src/app/services/cart/cart.service';
import { address, addressData } from '../../model';
import { checkNumberOrNot, checkStringOrNot } from 'src/app/validators/addressformValidators';

@Component({
  selector: 'app-input-address',
  templateUrl: './input-address.component.html',
  styleUrls: ['./input-address.component.scss']
})
export class InputAddressComponent {
  home: boolean = true
  work: boolean = false
  addressData!: addressData
  addressForm!: FormGroup
  constructor(private cartservice: CartService) {

  }

  ngOnInit(): void {
    this.addressForm = new FormGroup({
      name: new FormControl('', [Validators.required, checkStringOrNot.bind(this)]),
      phoneNumber: new FormControl('', [Validators.required, Validators.maxLength(10), Validators.minLength(10), checkNumberOrNot.bind(this)]),
      pincode: new FormControl('', [Validators.required, Validators.maxLength(6), Validators.minLength(6), checkNumberOrNot.bind(this)]),
      address: new FormControl('', [Validators.required]),
      locality: new FormControl('', [Validators.required, checkStringOrNot.bind(this)]),
      district: new FormControl('', [Validators.required, checkStringOrNot.bind(this)]),
      state: new FormControl('', [Validators.required, checkStringOrNot.bind(this)]),
      belongsTo: new FormControl('home', [Validators.required]),
      default: new FormControl(false)
    })

  }



  setBelongsTo(data: string) {
    if (data === 'home') {
      this.home = true
      this.work = false
    } else {
      this.work = true
      this.home = false
    }
    this.addressForm.patchValue({
      belongsTo: data
    })
  }


  

  submitAddressForm() {

    this.addressData = this.addressForm.value
    this.addressData.phoneNumber = this.addressData.phoneNumber.toString()
    this.addressData.pincode = this.addressData.pincode.toString()

    this.cartservice.postMethod_toAddAddress(this.addressData).pipe(concatMap((el) => {
      return this.cartservice.getMethod_toGetAddresses()
    })).subscribe((data) => {

      this.cartservice.addressess.next(data)
    })


  }
}
