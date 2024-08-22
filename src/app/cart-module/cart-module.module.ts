import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartComponent } from './cart/cart.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { MatStepperModule } from '@angular/material/stepper';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CartBagComponent } from './cart-bag/cart-bag.component';
import { ProductComponent } from './cart-bag/product/product.component';
import { AddressComponent } from './address/address.component';
import { InputAddressComponent } from './address/input-address/input-address.component';
import { PaymentComponent } from './payment/payment.component';

@NgModule({
  declarations: [
    CartComponent,
    CartBagComponent,
    ProductComponent,
    AddressComponent,
    InputAddressComponent,
    PaymentComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class CartModuleModule {}
