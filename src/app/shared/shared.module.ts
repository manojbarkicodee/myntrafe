import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';
import { MatBadgeModule } from '@angular/material/badge';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { FirstlettercapPipe } from './pipes/firstlettercap/firstlettercap.pipe';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { NavtologinComponent } from './navtologin/navtologin.component';
import { SizelistComponent } from './matdialogs/sizelist/sizelist.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatStepperModule } from '@angular/material/stepper';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { QuantitylistComponent } from './matdialogs/quantitylist/quantitylist.component';
import { DeleteAlertDialogComponent } from './matdialogs/delete-alert-dialog/delete-alert-dialog.component';
import { CouponListComponent } from './matdialogs/coupon-list/coupon-list.component';
import { AddressformComponent } from './matdialogs/addressform/addressform.component';
import { MatRadioModule } from '@angular/material/radio';
import { CardformComponent } from './matdialogs/cardform/cardform.component';
import { MaskingCardNumberPipe } from './pipes/maskingCard/maskingCardNUmber.pipe';
import { FormatingDatePipe } from './pipes/formatingDate/formating-date.pipe';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {MatSidenavModule} from '@angular/material/sidenav';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatListModule } from '@angular/material/list';
@NgModule({
  declarations: [
    FirstlettercapPipe,
    NavtologinComponent,
    SizelistComponent,
    QuantitylistComponent,
    DeleteAlertDialogComponent,
    CouponListComponent,
    AddressformComponent,
    CardformComponent,
    MaskingCardNumberPipe,
    FormatingDatePipe,
  ],
  imports: [
    CommonModule,
    MatSnackBarModule,
    MatDividerModule,
    MatBadgeModule,
    NgbModule,
    MatChipsModule,
    MatButtonModule,
    MatSelectModule,
    MatDialogModule,
    MatStepperModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatCheckboxModule,
    FormsModule,
    ReactiveFormsModule,
    MatRadioModule,
    MatSidenavModule,
    MatBottomSheetModule,
    MatListModule
  ],
  exports: [
    MatSnackBarModule,
    MatDividerModule,
    MatBadgeModule,
    MatIconModule,
    NgbModule,
    MatChipsModule,
    FirstlettercapPipe,
    MatButtonModule,
    MatSelectModule,
    NavtologinComponent,
    SizelistComponent,
    MatCheckboxModule,
    QuantitylistComponent,
    DeleteAlertDialogComponent,
    CouponListComponent,
    AddressformComponent,
    MatRadioModule,
    CardformComponent,
    MaskingCardNumberPipe,
    FormatingDatePipe,
    MatSidenavModule,
    MatBottomSheetModule,
    MatListModule
  ],
})
export class SharedModule {}
