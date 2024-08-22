import { Component, HostListener, OnInit } from '@angular/core';
import { Address, Product, orderDetails } from '../../model';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ShowShoppingDetailsDialogComponent } from '../show-shopping-details-dialog/show-shopping-details-dialog.component';
import { ProfileService } from 'src/app/services/profile/profile.service';
import { MatBottomSheet } from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-orders-details',
  templateUrl: './orders-details.component.html',
  styleUrls: ['./orders-details.component.scss'],
})
export class OrdersDetailsComponent implements OnInit {
  product!: Product;
  orderDetails!: orderDetails;
  products!: Product[];
  deliveryAddress!: Address;
  isMobileView:boolean=false
  constructor(
    private route: ActivatedRoute,
    private ordersService: ProfileService,
    private router: Router,
    public dialog: MatDialog,
    private _bottomSheet: MatBottomSheet
  ) {}
  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    this.checkScreenWidth();
  }
  ngOnInit(): void {
    this.checkScreenWidth()
    this.getOrdersDetailsOnChangeInQueryParams();
  }
  checkScreenWidth(): void {
    this.isMobileView = window.innerWidth <= 500; // Adjust the threshold as needed
  }
  openShopingDetailsDialog(event: Event, singleProduct: boolean) {
    let data;
    event.stopPropagation();

    if (singleProduct) {
      data ={mobileView:this.isMobileView,...this.product} ;
    } else {
      data ={mobileView:this.isMobileView,... this.orderDetails};
    }

    if(this.isMobileView){
      const dialogRef = this._bottomSheet.open(ShowShoppingDetailsDialogComponent, {
        data,
      });
  
      dialogRef.afterDismissed();
    }else{
      const dialogRef = this.dialog.open(ShowShoppingDetailsDialogComponent, {
        width: singleProduct ? '500px' : '550px',
        height: singleProduct ? '' : '420px',
        position: { top: '100px' },
        data,
      });
  
      dialogRef.afterClosed();
    }
    
  }

  getOrdersDetailsOnChangeInQueryParams() {
    this.route.params.subscribe((data) => {
      let { orderId, productId } = data;

      this.ordersService.getOrderedDetails().subscribe((orders) => {
        console.log(orders,orderId)
        this.orderDetails = orders.filter((order) => {
          return order.id === +orderId;
        })[0];
        console.log(this.orderDetails)
        this.deliveryAddress = this.orderDetails.address;
        this.product = this.orderDetails.products.filter((product) => {
          return product.id === +productId;
        })[0];
        this.products = this.orderDetails.products.filter((product) => {
          product.orderId = orderId;
          return product.id !== +productId;
        });
      });
    });
  }

  navToProduct(productId: number, category: string) {
    this.router.navigate(['/products', category, productId]);
  }
}
