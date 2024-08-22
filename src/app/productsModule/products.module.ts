import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { ProductsHeaderComponent } from './products/products-header/products-header.component';
import { ProductsSidebarComponent } from './products/products-sidebar/products-sidebar.component';
import { ProductsMainComponent } from './products/products-main/products-main.component';
import { FormsModule } from '@angular/forms';
import { CarouselComponent } from './products/products-main/carousel/carousel.component';
import { ProductComponent } from './products/product.component';
import { RouterModule } from '@angular/router';
import { ProductDetailsComponent } from './product/product.component';
import { IndivisualProductComponent } from './products/products-main/individual-product/individual-product.component';
import { SimilarProductsComponent } from './product/similar-products/similar-products.component';

@NgModule({
  declarations: [
    ProductsHeaderComponent,
    ProductsSidebarComponent,
    ProductsMainComponent,
    ProductComponent,
    CarouselComponent,
    IndivisualProductComponent,
    ProductDetailsComponent,
    SimilarProductsComponent,
  ],
  imports: [CommonModule, SharedModule, FormsModule, RouterModule],
})
export class ProductsModule { }
