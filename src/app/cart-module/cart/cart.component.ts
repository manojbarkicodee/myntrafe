import { CdkStep, StepperSelectionEvent } from '@angular/cdk/stepper';
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { MatStep, MatStepper } from '@angular/material/stepper';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit {
  checkLogin!: boolean;
  url!: string;
  dynamicCompData!: {
    header: string;
    paragraph: string;
    buttonText: string;
  };
  steps!: NodeList;
  index!: number;
  isLoading: boolean = false;
  @ViewChild('step1') step1!: MatStep;
  @Input() selected!: CdkStep | undefined;
  @ViewChild('stepper') stepper!: MatStepper;
  previousStep!: HTMLDivElement;
  @Output() selectionChange!: EventEmitter<StepperSelectionEvent>;
  selectedStep!: string;
  isMobileView:boolean=false;
  constructor(
    private authentication: AuthenticationService,
    private route: ActivatedRoute
  ) {}
  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    this.checkScreenWidth();
  }

  checkScreenWidth(): void {
    this.isMobileView = window.innerWidth <= 500; // Adjust the threshold as needed
  }
  ngOnInit(): void {
    this.checkScreenWidth()
    this.checkLogin = this.authentication.checkUserLogin();
    this.dynamicCompData = {
      header: 'PLEASE LOG IN',
      paragraph: 'Login to view items in your cart.',
      buttonText: 'LOGIN',
    };

    this.setCurrentRoute();
  }

  setCurrentRoute() {
    this.route.url.subscribe((url) => {
      this.url = url[0].path;
    });
  }

  getindex(event: StepperSelectionEvent) {
    if (event.previouslySelectedIndex === 2) {
      event.selectedStep.completed = false;
    } else if (event.previouslySelectedIndex === 1) {
      event.selectedStep.completed = false;
    }
  }

  nextStep(event: any) {
    this.isLoading = event;
    this.stepper.next();
  }

  nextbtn(step: MatStep) {
    this.stepper.next();
  }
}
