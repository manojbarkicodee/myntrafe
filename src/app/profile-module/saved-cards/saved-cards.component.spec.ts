import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
  waitForAsync,
} from '@angular/core/testing';

import { SavedCardsComponent } from './saved-cards.component';
import { CartService } from 'src/app/services/cart/cart.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatDialog } from '@angular/material/dialog';
import {
  MatBottomSheet,
  MatBottomSheetRef,
} from '@angular/material/bottom-sheet';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, Subject, Subscriber, of, throwError } from 'rxjs';
import { MatRadioButton } from '@angular/material/radio';
import { cards } from 'src/app/testing/mockData';
import { ElementRef, TemplateRef } from '@angular/core';
import { CardformComponent } from 'src/app/shared/matdialogs/cardform/cardform.component';

describe('SavedCardsComponent', () => {
  let component: SavedCardsComponent;
  let fixture: ComponentFixture<SavedCardsComponent>;
  let cartServiceSpy: jasmine.SpyObj<CartService>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;
  let bottomSheetSpy: jasmine.SpyObj<MatBottomSheet>;
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>;
  beforeEach(waitForAsync(() => {
    cartServiceSpy = jasmine.createSpyObj('CartService', [
      'getMethodToCards',
      'deleteMethodToCards',
    ]);
    cartServiceSpy.cards = new Subject();

    dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    bottomSheetSpy = jasmine.createSpyObj('MatBottomSheet', ['open']);
    snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);
    TestBed.configureTestingModule({
      declarations: [SavedCardsComponent],
      imports: [SharedModule],
      providers: [
        { provide: CartService, useValue: cartServiceSpy },
        { provide: MatDialog, useValue: dialogSpy },
        { provide: MatBottomSheet, useValue: bottomSheetSpy },
        { provide: MatSnackBar, useValue: snackBarSpy },
      ],
    }).compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(SavedCardsComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('ngOnInit', () => {
    it('should call checkScreenWidth and call getMethodToCards and call subject cards with data', () => {
      spyOn(component, 'checkScreenWidth');
      spyOn(cartServiceSpy.cards, 'next');
      cartServiceSpy.getMethodToCards.and.returnValue(of(cards));
      component.ngOnInit();
      expect(component.checkScreenWidth).toHaveBeenCalled();
      expect(cartServiceSpy.getMethodToCards).toHaveBeenCalled();
      expect(cartServiceSpy.cards.next).toHaveBeenCalledWith(cards);
    });

    it('should subscribe to cartservice.cards and set cards and call setScrollTo', () => {
      cartServiceSpy.getMethodToCards.and.returnValue(of(cards));
      spyOn(component, 'setScrollTo');
      let element = document.createElement('div');
      component.scrollableElement = element;
      component.ngOnInit();
      cartServiceSpy.cards.next(cards);
      expect(component.cards).toEqual(cards);
      expect(component.setScrollTo).toHaveBeenCalled();
    });
    it('should subscribe to cartservice.cards and set cards and not call setScrollTo', () => {
      cartServiceSpy.getMethodToCards.and.returnValue(of(cards));
      spyOn(component, 'setScrollTo');
      component.ngOnInit();
      cartServiceSpy.cards.next(cards);
      expect(component.cards).toEqual(cards);
      expect(component.setScrollTo).not.toHaveBeenCalled();
    });
  });

  describe('ngAfterViewInit', () => {
    it('should set scrollableElement and call setScrollTo after a delay', fakeAsync(() => {
      const mockElementRef = {
        nativeElement: document.createElement('div'),
      } as ElementRef;

      component.scrollable = mockElementRef;

      spyOn(component, 'setScrollTo');

      component.ngAfterViewInit();
      tick(500);

      expect(component.scrollableElement).toBeDefined();
      expect(component.setScrollTo).toHaveBeenCalled();
    }));
  });
  describe('onResize', () => {
    it('should call checkScreenWidth on window resize', () => {
      spyOn(component, 'checkScreenWidth');

      window.dispatchEvent(new Event('resize'));

      expect(component.checkScreenWidth).toHaveBeenCalled();
    });
  });
  describe('checkScreenWidth', () => {
    it('should set isMobileView to true when window.innerWidth is less than or equal to 500', () => {
      spyOnProperty(window, 'innerWidth', 'get').and.returnValue(480);
      component.checkScreenWidth();

      expect(component.isMobileView).toBeTruthy();
    });

    it('should set isMobileView to false when window.innerWidth is greater than 500', () => {
      spyOnProperty(window, 'innerWidth', 'get').and.returnValue(600);
      component.checkScreenWidth();

      expect(component.isMobileView).toBeFalsy();
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
    it('should call openSnackBar with the provided message and panelClass', () => {
      const openSnackBarSpy = spyOn(component, 'openSnackBar');

      component.showAlert('Test Message', 'test-panel-class');

      expect(openSnackBarSpy).toHaveBeenCalledWith(
        'Test Message',
        'ok',
        'test-panel-class'
      );
    });
  });
  describe('setScrollTo', () => {
    it('should add "toScroll" class if cards length is greater than 2', () => {
      component.cards = [cards[0], cards[0], cards[0]];
      component.scrollableElement = document.createElement('div');
      component.setScrollTo();

      expect(
        component.scrollableElement.classList.contains('toScroll')
      ).toBeTruthy();
    });

    it('should remove "toScroll" class if cards length is not greater than 2', () => {
      component.cards = cards;
      component.scrollableElement = document.createElement('div');
      component.setScrollTo();

      expect(
        component.scrollableElement.classList.contains('toScroll')
      ).toBeFalsy();
    });
  });
  describe('selectCardMethod', () => {
    it('should set radioBtn chcked to true', () => {
      const radioBtn: MatRadioButton = { checked: false } as MatRadioButton;

      component.selectCardMethod(radioBtn);

      expect(radioBtn.checked).toBeTrue();
    });
  });

  describe('deleteCard', () => {
    it('should call deleteMethodToCardsand call getMethodToCards', () => {
      spyOn(component, 'showAlert');
      spyOn(cartServiceSpy.cards, 'next');
      cartServiceSpy.deleteMethodToCards.and.returnValue(of({}));
      cartServiceSpy.getMethodToCards.and.returnValue(of(cards));
      component.deleteCard(4);
      expect(component.showAlert).toHaveBeenCalledWith(
        'Card deleted successfully',
        'success'
      );
      expect(cartServiceSpy.getMethodToCards).toHaveBeenCalled();
      expect(cartServiceSpy.cards.next).toHaveBeenCalledWith(cards);
    });
  });
  describe('openFormDialog', () => {
    it('should open bottom sheet if isMobileView is true', () => {
      component.isMobileView = true;
      bottomSheetSpy.open.and.returnValue({
        afterDismissed: () => of(''),
      } as any);
      component.openFormDialog();

      expect(bottomSheetSpy.open).toHaveBeenCalled();
    });

    it('should open dialog if isMobileView is false', () => {
      component.isMobileView = false;
      dialogSpy.open.and.returnValue({
        afterClosed: () => of(''),
      } as any);

      component.openFormDialog();

      expect(dialogSpy.open).toHaveBeenCalledWith(CardformComponent, {
        width: '450px',
        position: { top: '10px' },
        data: { mobileView: false },
      });
    });
  });

  describe('ngOnDestroy', () => {
    it('should unsubscribe cardsSubscription if cardsSubscription', () => {
      component.cardsSubscription = new Subscriber();
      spyOn(component.cardsSubscription, 'unsubscribe');

      component.ngOnDestroy();
      expect(component.cardsSubscription.unsubscribe).toHaveBeenCalled();
    });
   
  });
});
