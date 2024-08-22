import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';

import { CartComponent } from './cart.component';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { ActivatedRoute, Router, UrlSegment } from '@angular/router';
import { of } from 'rxjs';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { MatStep, MatStepper } from '@angular/material/stepper';

describe('CartComponent', () => {
  let component: CartComponent;
  let fixture: ComponentFixture<CartComponent>;
  let mockAuthenticationService: jasmine.SpyObj<AuthenticationService>;
  let mockActivatedRoute: ActivatedRoute;
  let matStepperMock: jasmine.SpyObj<MatStepper>;
  let matStepMock: jasmine.SpyObj<MatStep>;
  beforeEach(async () => {
    mockAuthenticationService = jasmine.createSpyObj('AuthenticationService', [
      'checkUserLogin',
    ]);
    matStepperMock = jasmine.createSpyObj('MatStepper', ['next']);
    matStepMock = jasmine.createSpyObj('MatStep', ['completed']);
    await TestBed.configureTestingModule({
      declarations: [CartComponent],
      providers: [
        { provide: MatStepper, useValue: matStepperMock },
        { provide: MatStep, useValue: matStepMock },
        { provide: AuthenticationService, useValue: mockAuthenticationService },
        {
          provide: ActivatedRoute,
          useValue: {
            url: of([{ path: 'login' }]),
            params: of({ category: 'testCategory', id: 'testId' }),
            queryParams: of({ reference: 'wishlist' }),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CartComponent);
    mockActivatedRoute = TestBed.inject(ActivatedRoute);
    component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should call checkScreenWidth and scrollToTop and setCurrentRoute and dynamicCompData and chekcLogin is false', () => {
      mockAuthenticationService.checkUserLogin.and.returnValue(false);
      spyOn(component, 'checkScreenWidth');
      spyOn(component, 'setCurrentRoute');
      component.ngOnInit();
      expect(component.checkLogin).toBeFalsy();
      expect(component.checkScreenWidth).toHaveBeenCalled();
      expect(component.setCurrentRoute).toHaveBeenCalled();
      expect(component.dynamicCompData).toEqual({
        header: 'PLEASE LOG IN',
        paragraph: 'Login to view items in your cart.',
        buttonText: 'LOGIN',
      });
    });
  });
  describe('onResize', () => {
    it('should call checkScreenWidth', () => {
      spyOn(component, 'checkScreenWidth');
      const event = new Event('resize');

      component.onResize(event);

      expect(component.checkScreenWidth).toHaveBeenCalled();
    });
  });

  describe('checkScreenWidth', () => {
    it('should set isMobileView to true if window width is less than or equal to 500', () => {
      spyOnProperty(window, 'innerWidth').and.returnValue(400);

      component.checkScreenWidth();

      expect(component.isMobileView).toBeTrue();
    });

    it('should set isMobileView to false if window width is greater than 500', () => {
      spyOnProperty(window, 'innerWidth').and.returnValue(600);

      component.checkScreenWidth();

      expect(component.isMobileView).toBeFalse();
    });
  });
  describe('setCurrentRoute', () => {
    it('should set the current route', fakeAsync(() => {
      mockActivatedRoute.url = of([{ path: 'mockPath' }] as UrlSegment[]);

      component.setCurrentRoute();
      tick();

      expect(component.url).toEqual('mockPath');
    }));
  });

  describe('getindex', () => {
    it('should update completed status on stepper selection change with previouslySelectedIndex 2', () => {
      component.step1 = matStepMock;

      const event: StepperSelectionEvent = {
        previouslySelectedIndex: 2,
        selectedStep: component.step1,
        previouslySelectedStep: matStepMock,
        selectedIndex: 1,
      };
      component.getindex(event);
      expect(event.selectedStep.completed).toBeFalsy();
    });

    it('should update completed status on stepper selection change with previouslySelectedIndex 1', () => {
      component.step1 = matStepMock;
      const event: StepperSelectionEvent = {
        previouslySelectedIndex: 1,
        selectedStep: component.step1,
        selectedIndex: 2,
        previouslySelectedStep: matStepMock,
      };
      component.getindex(event);
      expect(event.selectedStep.completed).toBeFalsy();
    });
  });

  describe('nextStep', () => {
    it('should set isLoading to true and move to the next step on nextStep', fakeAsync(() => {
      component.stepper = matStepperMock;
      component.nextStep(true);
      tick();
      expect(component.isLoading).toBeTruthy();
      expect(matStepperMock.next).toHaveBeenCalled();
    }));
  });

  describe('nextbtn', () => {
    it('should set isLoading to false and move to the next step on nextbtn', () => {
      component.stepper = matStepperMock;
      component.nextbtn(component.step1);
      expect(component.isLoading).toBeFalsy();
      expect(matStepperMock.next).toHaveBeenCalled();
    });
  });
});
