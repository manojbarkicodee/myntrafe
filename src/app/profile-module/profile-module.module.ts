import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from './profile/profile.component';
import { OverviewComponent } from './overview/overview.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OrdersComponent } from './orders/orders.component';
import { OrdersDetailsComponent } from './orders/orders-details/orders-details.component';
import { OrderedProductsComponent } from './orders/ordered-products/ordered-products.component';
import { SharedModule } from '../shared/shared.module';
import { CancelOrderDialogComponent } from './orders/cancel-order-dialog/cancel-order-dialog.component';
import { ShowShoppingDetailsDialogComponent } from './orders/show-shopping-details-dialog/show-shopping-details-dialog.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { AddressesComponent } from './addresses/addresses.component';
import { SavedCardsComponent } from './saved-cards/saved-cards.component';
import { PrivacypolicyComponent } from './privacypolicy/privacypolicy.component';
import { TermsComponent } from './terms/terms.component';

@NgModule({
  declarations: [
    ProfileComponent,
    OverviewComponent,
    OrdersComponent,
    OrdersDetailsComponent,
    OrderedProductsComponent,
    CancelOrderDialogComponent,
    ShowShoppingDetailsDialogComponent,
    UserProfileComponent,
    AddressesComponent,
    SavedCardsComponent,
    PrivacypolicyComponent,
    TermsComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
  ],
})
export class ProfileModuleModule {}
