import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { PaymentComponent } from './payment.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SharedModule } from 'src/app/shared/shared.module';
import { CartService } from 'src/app/services/cart/cart.service';
import { MatDialog } from '@angular/material/dialog';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { cards } from 'src/app/testing/mockData';
import { Subject, of } from 'rxjs';

describe('PaymentComponent', () => {
  let component: PaymentComponent;
  let fixture: ComponentFixture<PaymentComponent>;
  let cartServiceSpy: jasmine.SpyObj<CartService>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;
  let bottomSheetSpy: jasmine.SpyObj<MatBottomSheet>;
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>;
  let routerSpy: jasmine.SpyObj<Router>;
  beforeEach(async () => {
    const cartServiceSpyObj = jasmine.createSpyObj('CartService', [
      'getMethodToCards',
      'postMethodToPlaceOrder',
      'deleteMethod_toProductsInCart',
      'getMethod_GetCartProducts',
    ]);

    const dialogSpyObj = jasmine.createSpyObj('MatDialog', [
      'open',
      'afterClosed',
    ]);
    const bottomSheetSpyObj = jasmine.createSpyObj('MatBottomSheet', [
      'open',
      'afterDismissed',
    ]);
    const snackBarSpyObj = jasmine.createSpyObj('MatSnackBar', ['open']);
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);
    cartServiceSpyObj.cards = new Subject();
    cartServiceSpyObj.pricingDetails = new Subject();
    await TestBed.configureTestingModule({
      declarations: [PaymentComponent],
      imports: [HttpClientTestingModule, SharedModule],
      providers: [
        { provide: CartService, useValue: cartServiceSpyObj },
        { provide: MatDialog, useValue: dialogSpyObj },
        { provide: MatBottomSheet, useValue: bottomSheetSpyObj },
        { provide: MatSnackBar, useValue: snackBarSpyObj },
        { provide: Router, useValue: routerSpyObj },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PaymentComponent);
    component = fixture.componentInstance;
    cartServiceSpy = TestBed.inject(CartService) as jasmine.SpyObj<CartService>;
    dialogSpy = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;
    bottomSheetSpy = TestBed.inject(
      MatBottomSheet
    ) as jasmine.SpyObj<MatBottomSheet>;
    snackBarSpy = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should call getPricingDetails and getMethodToCards and emit to cards subject', () => {
      cartServiceSpy.getMethodToCards.and.returnValue(of(cards));
      spyOn(component, 'getPricingDetails');
      spyOn(cartServiceSpy.cards, 'next');
      component.ngOnInit();
      expect(component.getPricingDetails).toHaveBeenCalled();
      expect(cartServiceSpy.cards.next).toHaveBeenCalledWith(cards);
    });
    it('should set cards and call setScrollTo on if scrollableElement', () => {
      cartServiceSpy.getMethodToCards.and.returnValue(of(cards));
      component.scrollableElement = document.createElement('div');
      spyOn(component, 'getPricingDetails');
      spyOn(component, 'setScrollTo');
      component.ngOnInit();
      cartServiceSpy.cards.next(cards);
      expect(component.cards).toEqual(cards);
      expect(component.setScrollTo).toHaveBeenCalled();
    });
    it('should set cards and not to call setScrollTo on if not scrollableElement', () => {
      cartServiceSpy.getMethodToCards.and.returnValue(of(cards));
      spyOn(component, 'getPricingDetails');
      spyOn(component, 'setScrollTo');
      component.ngOnInit();
      cartServiceSpy.cards.next(cards);
      expect(component.cards).toEqual(cards);
      expect(component.setScrollTo).not.toHaveBeenCalled();
    });
  });

  describe('ngAfterViewInit', () => {
    it('should set scrollableElement', fakeAsync(() => {
      spyOn(component, 'setScrollTo');
      spyOn(component, 'getPricingDetails');
      cartServiceSpy.getMethodToCards.and.returnValue(of(cards));
      fixture.detectChanges();
      component.ngAfterViewInit();
      tick(500);
      expect(component.setScrollTo).toHaveBeenCalled();
      expect(component.scrollableElement).toBeDefined();
    }));
  });

  describe('getPricingDetails', () => {
    it('should call pricingDetails subject and set pricingDetails and selectedProductsCount not defined if not selectedProducts', () => {
      let pricing = {
        totalMrp: 3698,
        discountOnMrp: 2442,
        totalAmount: 1256,
        estimatedDeliveryDate: '20 Jan 2024',
      };

      // [
      //   {
      //       "productId": 1054,
      //       "mrp": 1499,
      //       "price": 749,
      //       "discount": 750,
      //       "size": "M",
      //       "quantity": 1,
      //       "deliveryDate": "21 Jan 2024",
      //       "productImage": "http://assets.myntassets.com/assets/images/1364628/2016/8/31/11472636737718-Roadster-Men-Blue-Regular-Fit-Printed-Casual-Shirt-6121472636737160-1.jpg"
      //   },
      //   {
      //       "productId": 1059,
      //       "mrp": 1849,
      //       "price": 628,
      //       "discount": 1221,
      //       "size": "L",
      //       "quantity": 1,
      //       "deliveryDate": "21 Jan 2024",
      //       "productImage": "http://assets.myntassets.com/assets/images/7488102/2019/8/22/8002a744-0dad-4dbb-9481-cf0090134c3b1566454086786-Dennis-Lingo-Men-Pink-Slim-Fit-Solid-Casual-Shirt-9891566454-1.jpg"
      //   }
      // ]
      component.getPricingDetails();
      cartServiceSpy.pricingDetails.next(pricing);

      expect(component.pricingDetails).toEqual(pricing);
      expect(component.selectedProductsCount).not.toBeDefined();
    });
    it('should call pricingDetails subject and set pricingDetails and selectedProductsCount ', () => {
      let pricing = {
        totalMrp: 3698,
        discountOnMrp: 2442,
        totalAmount: 1256,
        estimatedDeliveryDate: '20 Jan 2024',
        selectedProducts:     [
          {
              "productId": 1054,
              "mrp": 1499,
              "price": 749,
              "discount": 750,
              "size": "M",
              "quantity": 1,
              "deliveryDate": "21 Jan 2024",
              "productImage": "http://assets.myntassets.com/assets/images/1364628/2016/8/31/11472636737718-Roadster-Men-Blue-Regular-Fit-Printed-Casual-Shirt-6121472636737160-1.jpg"
          },
          {
              "productId": 1059,
              "mrp": 1849,
              "price": 628,
              "discount": 1221,
              "size": "L",
              "quantity": 1,
              "deliveryDate": "21 Jan 2024",
              "productImage": "http://assets.myntassets.com/assets/images/7488102/2019/8/22/8002a744-0dad-4dbb-9481-cf0090134c3b1566454086786-Dennis-Lingo-Men-Pink-Slim-Fit-Solid-Casual-Shirt-9891566454-1.jpg"
          }
        ]
      };

 
      component.getPricingDetails();
      cartServiceSpy.pricingDetails.next(pricing);

      expect(component.pricingDetails).toEqual(pricing);
      expect(component.selectedProductsCount).toEqual(2);
    });
  });

  describe('openSnackBar', () => {
    it('should open snackbar with provided message, action, and panelClass', () => {
      const message = 'Test Message';
      const action = 'Test Action';
      const panelClass = 'test-panel-class';

      component.openSnackBar(message, action, panelClass);

      expect(snackBarSpy.open).toHaveBeenCalledWith(message, action, {
        duration: 1000,
      verticalPosition: 'top',
      horizontalPosition: 'right',
      panelClass: [panelClass],
      });
    });
  });

  describe('showAlert', () => {
    it('should open snackbar with provided message and panelClass', () => {
      const openSnackBarSpy = spyOn(component, 'openSnackBar');

      const message = 'Test Message';
      const panelClass = 'test-panel-class';

      component.showAlert(message, panelClass);

      expect(openSnackBarSpy).toHaveBeenCalledWith(message, 'ok', panelClass);
    });
  });

  describe('setScrollTo',()=>{
  it('should add class on cards.length is greater than 2',()=>{
  component.scrollableElement=document.createElement('div')
  spyOn(component.scrollableElement.classList,'add')
  component.cards=cards
  component.setScrollTo()
  expect(component.scrollableElement.classList.add)
  })
  })
});
