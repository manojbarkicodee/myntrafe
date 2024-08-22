import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { MatRadioButton } from '@angular/material/radio';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { cardresponse, outputCardData } from 'src/app/cart-module/model';
import { CartService } from 'src/app/services/cart/cart.service';
import { CardformComponent } from 'src/app/shared/matdialogs/cardform/cardform.component';

@Component({
  selector: 'app-saved-cards',
  templateUrl: './saved-cards.component.html',
  styleUrls: ['./saved-cards.component.scss'],
})
export class SavedCardsComponent implements OnInit, AfterViewInit {
  cards!: cardresponse[];
  cardsSubscription!: Subscription;
  cardNumber!: string;
  expiryDate!: string;
  scrollableElement!: HTMLDivElement;
  isMobileView:boolean=false;
  @ViewChild('scrollable') scrollable!: ElementRef;

  constructor(
    private cartservice: CartService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private _bottomSheet: MatBottomSheet
  ) {}
  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    this.checkScreenWidth();
  }
  ngOnInit(): void {
    this.checkScreenWidth()
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

  checkScreenWidth(): void {
    this.isMobileView = window.innerWidth <= 500; // Adjust the threshold as needed
  }
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.scrollableElement = this.scrollable.nativeElement as HTMLDivElement;
      this.setScrollTo();
    }, 500);
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
  }

  deleteCard(id: number) {
    this.cartservice.deleteMethodToCards(id).subscribe({
      next: (data) => {
          this.showAlert('Card deleted successfully','success')
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        this.cartservice.getMethodToCards().subscribe((data)=>{
          this.cartservice.cards.next(data)
        })
      },
    });
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
  ngOnDestroy(): void {
    if( this.cardsSubscription){
      this.cardsSubscription.unsubscribe();

    }
  }
}
