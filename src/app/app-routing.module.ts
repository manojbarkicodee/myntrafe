import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignupComponent } from './userModule/Auth/signup.component';
import { ProductComponent } from './productsModule/products/product.component';
import { HomeComponent } from './home/homepage/home.component';
import { ProductDetailsComponent } from './productsModule/product/product.component';
import { WishlistComponent } from './wishlist-module/wishlist/wishlist.component';
import { CartComponent } from './cart-module/cart/cart.component';
import { ProfileComponent } from './profile-module/profile/profile.component';
import { OverviewComponent } from './profile-module/overview/overview.component';
import { OrdersComponent } from './profile-module/orders/orders.component';
import { OrdersDetailsComponent } from './profile-module/orders/orders-details/orders-details.component';
import { UserProfileComponent } from './profile-module/user-profile/user-profile.component';
import { AuthGuardService } from './services/authenticationGuard/auth-guard.service';
import { AddressesComponent } from './profile-module/addresses/addresses.component';
import { SavedCardsComponent } from './profile-module/saved-cards/saved-cards.component';
import { PrivacypolicyComponent } from './profile-module/privacypolicy/privacypolicy.component';
import { TermsComponent } from './profile-module/terms/terms.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: HomeComponent,
  },
  {
    path: 'signup',
    component: SignupComponent,
  },
  {
    path: 'login',
    component: SignupComponent,
  },
  {
    path: 'products',
    component: ProductComponent,
  },

  {
    path: 'products/:category',
    component: ProductComponent,
  },
  {
    path: 'products/:category/:id',
    component: ProductDetailsComponent,
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuardService],
    children: [
      {
        path: 'dashboard',
        component: OverviewComponent,
      },
      {
        path: 'orders',
        component: OrdersComponent,
      },
      {
        path: 'orders/:orderId/:productId',
        component: OrdersDetailsComponent,
      },
      {
        path: 'edit',
        component: UserProfileComponent,
      },
      {
        path: '',
        component: UserProfileComponent,
      },
      {
        path: 'addresses',
        component: AddressesComponent,
      },
      {
        path: 'cards',
        component: SavedCardsComponent,
      },
    ],
  },
  {
    path: 'privacypolicy',
    component: PrivacypolicyComponent,
  },
  {
    path: 'termsofuse',
    component: TermsComponent,
  },
  {
    path: 'wishlist',
    component: WishlistComponent,
  },
  {
    path: 'cart',
    component: CartComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
