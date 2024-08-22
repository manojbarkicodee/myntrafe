import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { CartService } from 'src/app/services/cart/cart.service';
import {
  cardresponse,
  orderPayload,
  orderedProducts,
  outputCardData,
  pricingDetails,
} from '../model';
import { MatDialog } from '@angular/material/dialog';
import { CardformComponent } from 'src/app/shared/matdialogs/cardform/cardform.component';
import { Subscription, concatMap, retry } from 'rxjs';
import { MatRadioButton } from '@angular/material/radio';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { Router } from '@angular/router';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss'],
})
export class PaymentComponent implements OnInit, AfterViewInit, OnDestroy {
  pricingDetails!: pricingDetails;
  selectedProductsCount!: number;
  cards!: cardresponse[];
  cardsSubscription!: Subscription;
  pricingDetailsSubscription!: Subscription;
  cardNumber!: string;
  expiryDate!: string;
  scrollableElement!: HTMLDivElement;
  paymentMethod!: string;
  @Input()isMobileView!:boolean;
  @ViewChild('scrollable') scrollable!: ElementRef;
  constructor(
    private cartservice: CartService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private _bottomSheet: MatBottomSheet,
    private router:Router
  ) {}

  ngOnInit(): void {
    this.getPricingDetails();

    this.cartservice.getMethodToCards().subscribe({
      next: (data) => {
        this.cartservice.cards.next(data);
      },
      error: (error) => {},
    });

    this.cardsSubscription = this.cartservice.cards.subscribe({
      next: (cards) => {
        this.cards = cards;

        if (this.scrollableElement) {
          this.setScrollTo();
        }
      },
      error: (error) => {},
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.scrollableElement = this.scrollable.nativeElement as HTMLDivElement;
      this.setScrollTo();
    }, 500);
  }

  getPricingDetails() {
    this.pricingDetailsSubscription = this.cartservice.pricingDetails.subscribe(
      {
        next: (data) => {
          this.pricingDetails = data;
          if (this.pricingDetails?.selectedProducts) {
            this.selectedProductsCount =
              this.pricingDetails?.selectedProducts?.length;
          }
        },
        error: (error) => {},
      }
    );
  }

  openSnackBar(message: string, action: string, panelClass: string) {
    this.snackBar.open(message, action, {
      duration: 1000,
      verticalPosition: 'top',
      horizontalPosition: 'right',
      panelClass: [panelClass],
    });
  }

  showAlert(message: string, panelClass: string) {
    this.openSnackBar(message, 'ok', panelClass);
  }

  setScrollTo() {
    if (this.cards.length > 2) {
      this.scrollableElement.classList.add('toScroll');
    } else {
      this.scrollableElement.classList.remove('toScroll');
    }
  }

  selectCardMethod(radioBtn: MatRadioButton) {
    radioBtn.checked = true;
    this.paymentMethod = radioBtn.value;
  }

  openFormDialog() {
    if (this.isMobileView) {
      let dialog = this._bottomSheet.open(CardformComponent, {
        data: {
          mobileView: this.isMobileView,
        },
      });
      dialog.afterDismissed();
    } else {
      let dialog = this.dialog.open(CardformComponent, {
        width: '450px',
        position: { top: '10px' },
        data: {
          mobileView: this.isMobileView,
        },
      });
      dialog.afterClosed();
    }
   
  }

  placeOrderMethod() {
    if (this.paymentMethod) {
      let orderdProducts = this.pricingDetails.selectedProducts?.map(
        (product) => {
          return {
            productId: product.productId,
            quantity: product.quantity,
            size: product.size,
          };
        }
      )||[];

      let payload: orderPayload = {
        deliveryAddressId: this.cartservice.selectedAddress.id,
        totalPrice: this.pricingDetails.totalAmount,
        discountedPrice: this.pricingDetails.discountOnMrp,
        paymentMethod: this.paymentMethod,
        estimatedDeliveryDate: this.pricingDetails.estimatedDeliveryDate,
        products: orderdProducts,
      };

      this.cartservice
        .postMethodToPlaceOrder(payload)
        .pipe(
          concatMap((data) => {
            this.showAlert(data.message, 'success');
            this.router.navigate(['/profile/orders', data.orderId, orderdProducts[0].productId], {});
            let products =
              orderdProducts
                ?.map((product) => {
                  return product.productId;
                })
                .join(',') || 0;

            return this.cartservice.deleteMethod_toProductsInCart(products);
          }),
          concatMap(() => {
            return this.cartservice.getMethod_GetCartProducts();
          })
        )
        .subscribe({
          next: (data) => {
            this.cartservice.cartProducts.next(data[0].products);
          },
          error: (error) => {},
        });
    } else {
      this.showAlert('select payment to proceed', 'warn');
    }
  }

  ngOnDestroy(): void {
    if( this.cardsSubscription){
      this.cardsSubscription.unsubscribe();
    }
    if(this.pricingDetailsSubscription){
      this.pricingDetailsSubscription.unsubscribe();
    }
  }
}
