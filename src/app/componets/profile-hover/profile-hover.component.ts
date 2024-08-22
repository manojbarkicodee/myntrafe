import { Component, HostListener, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { CartService } from 'src/app/services/cart/cart.service';

@Component({
  selector: 'app-profile-hover',
  templateUrl: './profile-hover.component.html',
  styleUrls: ['./profile-hover.component.scss'],
})
export class ProfileHoverComponent implements OnInit {
  @Input() hover: boolean = false;
  @Input() url!: string;
  @Input() checkLogin!: boolean;
  @Input() userName!: string;
  isMobileView: boolean = false;
  constructor(
    private cartService: CartService,
    private router: Router,
    private Authentication: AuthenticationService
  ) {}
  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    this.checkScreenWidth();
  }

  checkScreenWidth(): void {
    this.isMobileView = window.innerWidth <= 500; // Adjust the threshold as needed
  }

  navigateToSignUp() {
    this.router.navigate(['/signup'], { queryParams: { reference: this.url } });
    this.hover = false;
  }
  ngOnInit(): void {
    this.checkScreenWidth();
  }
  logoutMethod() {
    this.Authentication.logoutMethod();
    this.checkLogin = false;
    this.cartService.productsCount.next(0);
    // this.window.location.reload()
  }

  closeProfile() {
    this.hover = false;
  }
}
