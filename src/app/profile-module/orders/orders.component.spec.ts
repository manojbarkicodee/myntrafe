import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdersComponent } from './orders.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterTestingModule } from '@angular/router/testing';
import { OrderedProductsComponent } from './ordered-products/ordered-products.component';
import { ProfileService } from 'src/app/services/profile/profile.service';
import { httpService } from 'src/app/services/products/products.service';
import { Subject, Subscriber, Subscription, of } from 'rxjs';
import { orderredDetails } from 'src/app/testing/mockData';
import { orderredProducts } from 'src/app/testing/productsMockDta';

describe('OrdersComponent', () => {
  let component: OrdersComponent;
  let fixture: ComponentFixture<OrdersComponent>;
  let mockOrderService: jasmine.SpyObj<ProfileService>;
  let mockHttpService: jasmine.SpyObj<httpService>;
  beforeEach(async () => {
    mockOrderService = jasmine.createSpyObj('ProfileService', [
      'getOrderedDetails',
    ]);
    mockHttpService = jasmine.createSpyObj('httpService', ['scrollToTop']);
    mockOrderService.orderDetails = new Subject();
    await TestBed.configureTestingModule({
      declarations: [OrdersComponent, OrderedProductsComponent],
      imports: [HttpClientTestingModule, RouterTestingModule, SharedModule],
      providers: [
        { provide: ProfileService, useValue: mockOrderService },
        { provide: httpService, useValue: mockHttpService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(OrdersComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should call getOrderedDetails and call getOrderedProducts', () => {
      mockOrderService.getOrderedDetails.and.returnValue(of(orderredDetails));
      spyOn(mockOrderService.orderDetails, 'next');
      spyOn(component, 'getOrderedProducts');
      component.ngOnInit();
      expect(mockOrderService.orderDetails.next).toHaveBeenCalledWith(
        orderredDetails
      );
      expect(mockOrderService.getOrderedDetails).toHaveBeenCalled();
      expect(component.getOrderedProducts).toHaveBeenCalled();
    });
  });

  describe('getOrderedProducts', () => {
    it('should update orderedProducts, noProducts, totalProducts, totalpages, and paginatedProducts when orderDetails change', () => {
      const mockOrderDetails = [
        {
          id: 1,
          products: [{}, {}],
          createdAt: '2022-01-01',
          estimatedDeliveryDate: '2022-01-05',
        },
      ];
      mockOrderService.getOrderedDetails.and.returnValue(of(orderredDetails));

      component.ngOnInit();
      fixture.detectChanges();

      expect(component.orderedProducts).toBeDefined();
      expect(component.noProducts).toBeFalsy();
      expect(component.totalProducts).toBe(
        orderredDetails[0].products.length + orderredDetails[1].products.length
      );
      expect(component.totalpages).toBe(Math.ceil(component.totalProducts / 5));
      expect(component.paginatedProducts).toBeDefined();
    });
    it('should handle no products case', () => {
      mockOrderService.getOrderedDetails.and.returnValue(of([]));

      component.ngOnInit();
      fixture.detectChanges();

      expect(component.orderedProducts).toBeDefined();
      expect(component.noProducts).toBeTruthy();
      expect(component.totalProducts).toBe(0);
      expect(component.totalpages).toBe(0);
      expect(component.paginatedProducts).toBeDefined();
    });

    it('should update orderedProducts, noProducts, totalProducts, totalpages, and paginatedProducts for reversed orderDetails', () => {
      const mockOrderDetails = [
        {
          id: 1,
          products: [{}, {}],
          createdAt: '2022-01-01',
          estimatedDeliveryDate: '2022-01-05',
        },
      ];
      mockOrderService.getOrderedDetails.and.returnValue(of(orderredDetails));

      component.ngOnInit();
      fixture.detectChanges();

      expect(component.orderedProducts).toBeDefined();
      expect(component.noProducts).toBeFalsy();
      expect(component.totalProducts).toBe(
        orderredDetails[0].products.length + orderredDetails[1].products.length
      );
      expect(component.totalpages).toBe(Math.ceil(component.totalProducts / 5));
      expect(component.paginatedProducts).toBeDefined();
    });

    it('should handle checkOrderStatus and set properties for each product', () => {
      const mockOrderDetails = [
        {
          id: 1,
          products: [{}, {}],
          createdAt: '2022-01-01',
          estimatedDeliveryDate: '2022-01-05',
        },
      ];
      mockOrderService.getOrderedDetails.and.returnValue(of(orderredDetails));

      spyOn(component, 'checkOrderStatus').and.returnValue({
        status: 'MockStatus',
        description: 'MockDescription',
        validToDeleteOrder: true,
      });

      component.ngOnInit();
      fixture.detectChanges();
      console.log(component.orderedProducts);
      expect(component.orderedProducts[0].orderId).toBe(orderredDetails[1].id);
      expect(component.orderedProducts[0].orderCreatedAt).toBe(
        orderredDetails[1].createdAt
      );
      expect(component.orderedProducts[0].deliveryDate).toBe(
        orderredDetails[0].estimatedDeliveryDate
      );
      expect(component.orderedProducts[0].orderStatus).toBeDefined();
    });

    it('should set noProducts to true when orderedProducts is empty', () => {
      const mockOrderDetails = [
        {
          id: 1,
          products: [],
          createdAt: '2022-01-01',
          estimatedDeliveryDate: '2022-01-05',
        },
      ];
      mockOrderService.getOrderedDetails.and.returnValue(of([]));

      component.ngOnInit();
      fixture.detectChanges();

      expect(component.orderedProducts.length).toBe(0);
      expect(component.noProducts).toBeTruthy();
    });
  });

  describe('setDeliveryDate', () => {
    it('should return the formatted date string', () => {
      const day = 1;
      const month = 2;
      const date = 15;

      const result = component.setDeliveryDate(day, month, date);

      expect(result).toBe('Mon 15 Mar');
    });

    it('should return the formatted date string for the first day of the week', () => {
      const day = 0;
      const month = 4;
      const date = 23;

      const result = component.setDeliveryDate(day, month, date);

      expect(result).toBe('Sun 23 May');
    });

    it('should return an empty string for an invalid month', () => {
      const day = 1;
      const month = 13;
      const date = 15;

      const result = component.setDeliveryDate(day, month, date);

      expect(result).toBe('Mon 15 ');
    });
  });

  describe('paginationMethod', () => {
    it('should return the paginated data for the first page', () => {
      const page = 1;
      component.orderedProducts = orderredProducts;

      const result = component.paginationMethod(page);
      let paginationdata = orderredProducts.slice((page - 1) * 5, page * 5);
      expect(result).toEqual(paginationdata);
    });

    it('should return the paginated data for a middle page', () => {
      const page = 2;
      component.orderedProducts = orderredProducts;

      const result = component.paginationMethod(page);
      let paginationdata = orderredProducts.slice((page - 1) * 5, page * 5);
      expect(result).toEqual(paginationdata);
    });

    it('should scroll to top when called', () => {
      component.orderedProducts = orderredProducts;
      component.paginationMethod(1);

      expect(mockHttpService.scrollToTop).toHaveBeenCalled();
    });
  });

  describe('checkOrderStatus', () => {
    it('should return "Order confirmed" status with validToDeleteOrder as true and description with delivery date for the same day, when current time is after 1 hour of order confirmation', () => {
      const orderedDate = '2022-01-03T12:00:00';
      const currentTime = new Date('2022-01-03T15:00:00');
      const deliveryDate = '2022-01-07T17:00:00';

      const result = component.checkOrderStatus(
        orderedDate,
        currentTime,
        deliveryDate
      );

      expect(result).toEqual({
        status: 'Order confirmed',
        validToDeleteOrder: true,
        description: 'Arriving by, Fri 7 Jan',
      });
    });

    it('should return "Order Received" status with validToDeleteOrder as true for the same day when current time is before 1 hour of order confirmation', () => {
      const orderedDate = '2022-01-03T12:00:00';
      const currentTime = new Date('2022-01-03T12:00:00');
      const deliveryDate = '2022-01-07T17:00:00';

      const result = component.checkOrderStatus(
        orderedDate,
        currentTime,
        deliveryDate
      );

      expect(result).toEqual({
        status: 'Order Received',
        validToDeleteOrder: true,
        description: 'Your order will be confirmed shortly',
      });
    });

    it('should return "Packed" status with validToDeleteOrder as true for the day after 1 day of order confirmation', () => {
      const orderedDate = '2022-01-03T12:00:00';
      const currentTime = new Date('2022-01-04T15:00:00');
      const deliveryDate = '2022-01-07T17:00:00';

      const result = component.checkOrderStatus(
        orderedDate,
        currentTime,
        deliveryDate
      );

      expect(result).toEqual({
        status: 'Packed',
        validToDeleteOrder: true,
        description: 'Arriving by, Fri 7 Jan',
      });
    });
    it('should return "Packed" status with validToDeleteOrder as true for the day after 2 day of order confirmation but less than ordered time', () => {
      const orderedDate = '2022-01-03T12:00:00';
      const currentTime = new Date('2022-01-05T12:00:00');
      const deliveryDate = '2022-01-07T17:00:00';

      const result = component.checkOrderStatus(
        orderedDate,
        currentTime,
        deliveryDate
      );

      expect(result).toEqual({
        status: 'Packed',
        validToDeleteOrder: true,
        description: 'Arriving by, Fri 7 Jan',
      });
    });

    it('should return "Shipped" status with validToDeleteOrder as false for the day after 2 days of order confirmation', () => {
      const orderedDate = '2022-01-03T12:00:00';
      const currentTime = new Date('2022-01-05T15:00:00');
      const deliveryDate = '2022-01-07T17:00:00';

      const result = component.checkOrderStatus(
        orderedDate,
        currentTime,
        deliveryDate
      );

      expect(result).toEqual({
        status: 'Shipped',
        validToDeleteOrder: false,
        description: 'Arriving by, Fri 7 Jan',
      });
    });
    it('should return "Shipped" status with validToDeleteOrder as false for the day after 2 days of order confirmation but not react exact time of order', () => {
      const orderedDate = '2022-01-03T12:00:00';
      const currentTime = new Date('2022-01-06T12:00:00');
      const deliveryDate = '2022-01-07T17:00:00';

      const result = component.checkOrderStatus(
        orderedDate,
        currentTime,
        deliveryDate
      );

      expect(result).toEqual({
        status: 'Shipped',
        validToDeleteOrder: false,
        description: 'Arriving by, Fri 7 Jan',
      });
    });

    it('should return "Out for delivery" status with validToDeleteOrder as false for the day after 3 days of order confirmation', () => {
      const orderedDate = '2022-01-03T12:00:00';
      const currentTime = new Date('2022-01-06T15:00:00');
      const deliveryDate = '2022-01-07T17:00:00';

      const result = component.checkOrderStatus(
        orderedDate,
        currentTime,
        deliveryDate
      );

      expect(result).toEqual({
        status: 'Out for delivery',
        validToDeleteOrder: false,
        description: 'Arriving by, Fri 7 Jan',
      });
    });

    it('should return "Out for delivery" status with validToDeleteOrder as false for the day after 3 days of order confirmation but not react exact time of order', () => {
      const orderedDate = '2022-01-03T12:00:00';
      const currentTime = new Date('2022-01-07T12:00:00');
      const deliveryDate = '2022-01-07T17:00:00';

      const result = component.checkOrderStatus(
        orderedDate,
        currentTime,
        deliveryDate
      );

      expect(result).toEqual({
        status: 'Out for delivery',
        validToDeleteOrder: false,
        description: 'Arriving by, Fri 7 Jan',
      });
    });

    it('should return "Delivered" status with validToDeleteOrder as false for the day after 4 days of order confirmation ', () => {
      const orderedDate = '2022-01-03T12:00:00';
      const currentTime = new Date('2022-01-07T17:00:00');
      const deliveryDate = '2022-01-07T17:00:00';

      const result = component.checkOrderStatus(
        orderedDate,
        currentTime,
        deliveryDate
      );

      expect(result).toEqual({
        status: 'Delivered',
        validToDeleteOrder: false,
        description: 'Delivered by, Fri 7 Jan',
      });
    });

    it('should return "Delivered" status with validToDeleteOrder as false and description with delivery date and year for the day after 4 days of order confirmation', () => {
      const orderedDate = '2022-01-03T12:00:00';
      const currentTime = new Date('2022-05-07T17:00:00');
      const deliveryDate = '2022-01-07T17:00:00';

      const result = component.checkOrderStatus(
        orderedDate,
        currentTime,
        deliveryDate
      );

      expect(result).toEqual({
        status: 'Delivered',
        validToDeleteOrder: false,
        description: 'Delivered by, Fri 7 Jan, 2022',
      });
    });
  });

  describe('navToPreviousPage', () => {
    it('should call showPaginationBtns and set paginatedProducts and startProductNumber and endProductNUmber on page is greater than 1', () => {
      component.page = 2;
      spyOn(component, 'showPaginationBtns');
      const page = 1;
      component.orderedProducts = orderredProducts;
      component.paginatedProducts = orderredProducts.slice(
        (page - 1) * 5,
        page * 5
      );
      component.navToPreviousPage();
      console.log(
        component.endProductNUmber,
        component.paginatedProducts.length,
        '======>length123'
      );
      expect(component.showPaginationBtns).toHaveBeenCalled();
      expect(component.page).toEqual(1);
      expect(component.paginatedProducts).toEqual(
        orderredProducts.slice((component.page - 1) * 5, component.page * 5)
      );
      expect(component.endProductNUmber).toEqual(0);
      expect(component.startProductNumber).toEqual(-4);
    });
    it('should not call showPaginationBtns and set paginatedProducts and startProductNumber and endProductNUmber on page is less than 1', () => {
      component.page = 1;
      spyOn(component, 'showPaginationBtns');
      const page = 1;
      component.orderedProducts = orderredProducts;
      component.paginatedProducts = orderredProducts.slice(
        (page - 1) * 5,
        page * 5
      );
      component.navToPreviousPage();
      console.log(
        component.endProductNUmber,
        component.paginatedProducts.length,
        '======>length123'
      );
      expect(component.showPaginationBtns).not.toHaveBeenCalled();
    });
  });

  describe('navToNextPage', () => {
    it('should increase page and update pagination when next page is available', () => {
      component.page = 1;
      component.totalpages = 3;
      component.startProductNumber = 1;
      component.endProductNUmber = 5;
      component.orderedProducts = orderredProducts;
      component.paginatedProducts = orderredProducts.slice(
        (component.page - 1) * 5,
        component.page * 5
      );
      component.navToNextPage();

      expect(component.page).toBe(2);
      expect(component.startProductNumber).toBe(6);
      expect(component.endProductNUmber).toBe(10);
    });

    it('should not update page and pagination when next page is not available', () => {
      component.page = 3;
      const initialPage = component.page;
      component.totalpages = 3;
      const initialStartProductNumber = component.startProductNumber;
      const initialEndProductNUmber = component.endProductNUmber;
      component.paginatedProducts = orderredProducts.slice(
        (component.page - 1) * 5,
        component.page * 5
      );
      component.navToNextPage();

      expect(component.page).toBe(initialPage);
      expect(component.startProductNumber).toBe(initialStartProductNumber);
      expect(component.endProductNUmber).toBe(initialEndProductNUmber);
    });
  });

  describe('', () => {
    it('should update showPrev and showNext when page is 1', () => {
      component.page = 1;
      component.totalpages = 3;
      component.showPrev = true;
      component.showNext = true;

      component.showPaginationBtns();

      expect(component.showPrev).toBeFalse();
      expect(component.showNext).toBeTrue();
    });

    it('should update showPrev and showNext when page is in the middle', () => {
      component.page = 2;
      component.totalpages = 3;
      component.showPrev = false;
      component.showNext = true;

      component.showPaginationBtns();

      expect(component.showPrev).toBeTrue();
      expect(component.showNext).toBeTrue();
    });

    it('should update showPrev and showNext when page is the last page', () => {
      component.page = 3;
      component.totalpages = 3;
      component.showPrev = false;
      component.showNext = true;

      component.showPaginationBtns();

      expect(component.showPrev).toBeTrue();
      expect(component.showNext).toBeFalse();
    });
  });

  describe('ngOnDestroy', () => {
    it('should unsubscribe from orderDetailsSubscription if it exists', () => {
      component.orderDetailsSubscription = new Subscriber();
      spyOn(component.orderDetailsSubscription, 'unsubscribe');
      component.ngOnDestroy();

      expect(component.orderDetailsSubscription.unsubscribe).toHaveBeenCalled();
    });
  });
});
