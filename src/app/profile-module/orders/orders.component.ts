import { Component, OnDestroy, OnInit } from '@angular/core';
import { Product, orderDetails } from '../model';
import { Subscription } from 'rxjs';
import { httpService } from 'src/app/services/products/products.service';
import { ProfileService } from 'src/app/services/profile/profile.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
})
export class OrdersComponent implements OnInit, OnDestroy {
  orderedProducts!: Product[];
  orderStatus!: {
    status: string;
    description: string;
    validToDeleteOrder: boolean;
  };
  noProducts!:boolean
  page: number = 1;
  startProductNumber: number = 1;
  endProductNUmber: number = 5;
  totalProducts!: number;
  paginatedProducts!: Product[];
  showPrev: boolean = false;
  showNext: boolean = true;
  totalpages!: number;
  orderDetailsSubscription!: Subscription;
  constructor(
    private orderService: ProfileService,
    private scrollTo: httpService
  ) {}
  ngOnInit(): void {
    this.orderService.getOrderedDetails().subscribe((data) => {
      this.orderService.orderDetails.next(data);
    });
    this.getOrderedProducts();
  }

  getOrderedProducts() {
    this.orderDetailsSubscription = this.orderService.orderDetails.subscribe(
      (data) => {
        let newdata: orderDetails[] = [...data].reverse();


        this.orderedProducts = newdata.flatMap((order) => {
          let orderedProducts = order.products.map((product) => {
            product.orderId = order.id;
            product.orderCreatedAt = order.createdAt;
            product.deliveryDate = order.estimatedDeliveryDate;
            product.orderStatus = this.checkOrderStatus(
              product.orderCreatedAt,
              new Date(),
              product.deliveryDate
            ) || {
              status: 'Delivered',
              description: '',
              validToDeleteOrder: false,
            };

            return product;
          });

          return orderedProducts;
        });
        if(this.orderedProducts.length===0){
          this.noProducts=true
        }else{
          this.noProducts=false
        }
        this.totalProducts = this.orderedProducts.length;
        this.totalpages = Math.ceil(this.totalProducts / 5);
        this.paginatedProducts = this.paginationMethod(this.page);
      }
    );
  }

  setDeliveryDate(day: number, month: number, date: number): string {
    let months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    let days = ['Sun', 'Mon', 'Tues', 'Wed', 'Thu', 'Fri', 'Sat'];
    let requiredMonth = months[month]||'';

    let requiredDay = days[day]||'';

    return requiredDay + ' ' + date + ' ' + requiredMonth;
  }
  paginationMethod(page: number) {
    let startIndex = (page - 1) * 5;
    let endIndex = page * 5;
    // console.log(this.orderedProducts)
    let paginationData = this.orderedProducts.slice(startIndex, endIndex);
    this.scrollTo.scrollToTop();

    return paginationData;
  }
  checkOrderStatus(
    orderedDATE: string,
    currentTime: Date,
    deliveryDate: string
  ): void | {
    status: string;
    description: string;
    validToDeleteOrder: boolean;
  } {
    let currentDate = new Date(currentTime).getDate();
    let currentMonth = new Date(currentTime).getMonth();
    let currentYear = new Date(currentTime).getFullYear();
    let currentHours = new Date(currentTime).getHours();
    let currentMinutes = new Date(currentTime).getMinutes();
    let currentMinutesForValidation = currentHours * 60 + currentMinutes;

    let orderedDate = new Date(orderedDATE).getDate();
    let orderedMonth = new Date(orderedDATE).getMonth();
    let orderedYear = new Date(orderedDATE).getFullYear();
    let orderedHours = new Date(orderedDATE).getHours();
    let orderedMinutes = new Date(orderedDATE).getMinutes();
    let validMinutesForConfirmed = orderedHours * 60 + orderedMinutes + 60;
    let validMinutesForValidation = orderedHours * 60 + orderedMinutes;

    let deliverydate = new Date(deliveryDate).getDate();
    let deliveryMonth = +new Date(deliveryDate).getMonth();
    let deliveryDay = +new Date(deliveryDate).getDay();
    let deliveryYear=new Date(deliveryDate).getFullYear()
   console.log(orderedDate,currentDate,'==>date',orderedMonth,currentMonth,'===>month',currentMinutesForValidation,validMinutesForConfirmed)
    if (
      orderedDate === currentDate &&
      orderedMonth === currentMonth &&
      orderedYear === currentYear &&
      currentMinutesForValidation > validMinutesForConfirmed
    ) {
      return {
        status: 'Order confirmed',
        validToDeleteOrder: true,
        description: `Arriving by, ${this.setDeliveryDate(
          deliveryDay,
          deliveryMonth,
          deliverydate
        )}`,
      };
    } else if (
      orderedDate + 1 === currentDate &&
      currentMinutesForValidation < validMinutesForValidation
    ) {
      return {
        status: 'Order confirmed',
        validToDeleteOrder: true,
        description: `Arriving by, ${this.setDeliveryDate(
          deliveryDay,
          deliveryMonth,
          deliverydate
        )}`,
      };
    } else if (
      orderedDate === currentDate &&
      orderedMonth === currentMonth &&
      orderedYear === currentYear &&
      currentMinutesForValidation < validMinutesForConfirmed
    ) {
      return {
        status: 'Order Received',
        description: 'Your order will be confirmed shortly',
        validToDeleteOrder: true,
      };
    } else if (
      currentDate === orderedDate + 1 &&
      orderedMonth === currentMonth &&
      orderedYear === currentYear &&
      currentMinutesForValidation > validMinutesForValidation
    ) {
      return {
        status: 'Packed',
        validToDeleteOrder: true,
        description: `Arriving by, ${this.setDeliveryDate(
          deliveryDay,
          deliveryMonth,
          deliverydate
        )}`,
      };
    } else if (
      currentDate === orderedDate + 2 &&
      orderedMonth === currentMonth &&
      orderedYear === currentYear &&
      currentMinutesForValidation <= validMinutesForValidation
    ) {
      return {
        status: 'Packed',
        validToDeleteOrder: true,
        description: `Arriving by, ${this.setDeliveryDate(
          deliveryDay,
          deliveryMonth,
          deliverydate
        )}`,
      };
    } else if (
      currentDate === orderedDate + 2 &&
      orderedMonth === currentMonth &&
      orderedYear === currentYear &&
      currentMinutesForValidation > validMinutesForValidation
    ) {
      // this.validTimeToDeleteOrder=false
      return {
        status: 'Shipped',
        validToDeleteOrder: false,
        description: `Arriving by, ${this.setDeliveryDate(
          deliveryDay,
          deliveryMonth,
          deliverydate
        )}`,
      };
    } else if (
      currentDate === orderedDate + 3 &&
      orderedMonth === currentMonth &&
      orderedYear === currentYear &&
      currentMinutesForValidation <= validMinutesForValidation
    ) {
      // this.validTimeToDeleteOrder=false
      return {
        status: 'Shipped',
        validToDeleteOrder: false,
        description: `Arriving by, ${this.setDeliveryDate(
          deliveryDay,
          deliveryMonth,
          deliverydate
        )}`,
      };
    } else if (
      currentDate === orderedDate + 3 &&
      orderedMonth === currentMonth &&
      orderedYear === currentYear &&
      currentMinutesForValidation > validMinutesForValidation
    ) {
      return {
        status: 'Out for delivery',
        validToDeleteOrder: false,
        description: `Arriving by, ${this.setDeliveryDate(
          deliveryDay,
          deliveryMonth,
          deliverydate
        )}`,
      };
    } else if (
      currentDate === orderedDate + 4 &&
      orderedMonth === currentMonth &&
      orderedYear === currentYear &&
      currentMinutesForValidation <= validMinutesForValidation
    ) {
      return {
        status: 'Out for delivery',
        validToDeleteOrder: false,
        description: `Arriving by, ${this.setDeliveryDate(
          deliveryDay,
          deliveryMonth,
          deliverydate
        )}`,
      };
    } else if (
      currentDate >= orderedDate + 4 &&
      orderedMonth >= currentMonth &&
      orderedYear >= currentYear
    ) {
      return {
        status: 'Delivered',
        validToDeleteOrder: false,
        description: `Delivered by, ${this.setDeliveryDate(
          deliveryDay,
          deliveryMonth,
          deliverydate
        )}`,
      };
    }else{

      return {
        status: 'Delivered',
        validToDeleteOrder: false,
        description: `Delivered by, ${this.setDeliveryDate(
          deliveryDay,
          deliveryMonth,
          deliverydate
        )}, ${deliveryYear}`,
      };
    }
  }

  navToPreviousPage() {
    if (this.page > 1) {
      this.page = this.page - 1;
      this.showPaginationBtns();
      console.log(this.endProductNUmber,this.paginatedProducts.length,'======>length')
      this.endProductNUmber =
        this.endProductNUmber - this.paginatedProducts.length;

      this.paginatedProducts = this.paginationMethod(this.page);
      this.startProductNumber = this.startProductNumber - 5;
    }
  }
  navToNextPage() {
    if (this.page < this.totalpages) {
      this.page = this.page + 1;
      this.showPaginationBtns();
      this.paginatedProducts = this.paginationMethod(this.page);
      this.startProductNumber = this.startProductNumber + 5;
      this.endProductNUmber =
        this.endProductNUmber + this.paginatedProducts.length;
    }
  }

  showPaginationBtns() {
    if (this.page === 1) {
      this.showPrev = false;
      if (!this.showNext) this.showNext = true;
    } else if (this.page > 1 && this.page < this.totalpages) {
      this.showPrev = true;
      this.showNext = true;
    } else if (this.page > 1 && this.page === this.totalpages) {
      this.showPrev = true;
      this.showNext = false;
    }
  }

  ngOnDestroy(): void {
    if(this.orderDetailsSubscription){
      this.orderDetailsSubscription.unsubscribe();
    }
  }
}
