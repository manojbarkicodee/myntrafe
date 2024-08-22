import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UserModule } from './userModule/user.module';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ProductsModule } from './productsModule/products.module';
import { SharedModule } from './shared/shared.module';
import { FooterComponent } from './componets/footer/footer.component';
import { NavbarComponent } from './componets/navbar/navbar.component';
import { ProfileHoverComponent } from './componets/profile-hover/profile-hover.component';
import { HomeModule } from './home/home.module';
import { HeadersInterceptorService } from './services/interceptor/headers.interceptor.service';
import { WishlistModuleModule } from './wishlist-module/wishlist-module.module';
import { CartModuleModule } from './cart-module/cart-module.module';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ProfileModuleModule } from './profile-module/profile-module.module';

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    NavbarComponent,
    ProfileHoverComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    UserModule,
    HttpClientModule,
    ProductsModule,
    BrowserAnimationsModule,
    SharedModule,
    HomeModule,
    WishlistModuleModule,
    CartModuleModule,
    FormsModule,
    ProfileModuleModule,
    RouterModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HeadersInterceptorService,
      multi: true,
    },
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent],
})
export class AppModule {}
