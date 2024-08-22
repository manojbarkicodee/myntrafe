import { NgModule, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WishlistComponent } from './wishlist/wishlist.component';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [WishlistComponent],
  imports: [CommonModule, SharedModule, RouterModule],
})
export class WishlistModuleModule {}
