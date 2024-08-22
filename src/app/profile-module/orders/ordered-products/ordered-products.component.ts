import { Component, HostListener, Input, OnInit } from '@angular/core';
import { Product } from '../../model';
import { ActivatedRoute, Router } from '@angular/router';
import { product } from 'src/app/productsModule/model';
import { httpService } from 'src/app/services/products/products.service';
import { MatDialog } from '@angular/material/dialog';
import { CancelOrderDialogComponent } from '../cancel-order-dialog/cancel-order-dialog.component';
import { MatBottomSheet } from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-ordered-products',
  templateUrl: './ordered-products.component.html',
  styleUrls: ['./ordered-products.component.scss'],
})
export class OrderedProductsComponent implements OnInit {
  @Input() orderedProducts!: Product[];
  @Input() checkOrders!: boolean;
  isMobileView: boolean = false;
  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    this.checkScreenWidth();
  }
  constructor(
    public dialog: MatDialog,
    private scrollService: httpService,
    private route: ActivatedRoute,
    private router: Router,
    private _bottomSheet: MatBottomSheet
  ) {}
  ngOnInit(): void {
    this.checkScreenWidth();
  }
  navToOrdersDetails(orderId?: number, productId?: number) {
    if (this.checkOrders) {
      this.router.navigate([orderId, productId], {
        relativeTo: this.route,
      });
    } else {
      this.router.navigate(['/profile/orders', orderId, productId], {});
      this.scrollService.scrollToTop();
    }
  }
  checkScreenWidth(): void {
    this.isMobileView = window.innerWidth <= 500; // Adjust the threshold as needed
  }
  openCancelOrderDialog(event: Event, orderId?: number, productId?: number) {
    event.stopPropagation();
    if (this.isMobileView) {
      const dialogRef = this._bottomSheet.open(CancelOrderDialogComponent, {
        data: {
          orderId: orderId,
          productId: productId,
          mobileView: this.isMobileView,
        },
      });

      dialogRef.afterDismissed();
    } else {
      const dialogRef = this.dialog.open(CancelOrderDialogComponent, {
        width: '400px',
        height: '400px',
        position: { top: '30px' },
        data: {
          orderId: orderId,
          productId: productId,
          mobileView: this.isMobileView,
        },
      });

      dialogRef.afterClosed();
    }
  }
}
