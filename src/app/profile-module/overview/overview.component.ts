import { Component, HostListener, OnInit } from '@angular/core';
import { dashboardElementsSchema } from '../model';
import { dashboardElements } from '../staticdata';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { ProfileService } from 'src/app/services/profile/profile.service';
import { CartService } from 'src/app/services/cart/cart.service';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
})
export class OverviewComponent implements OnInit {
  dashboardElements!: dashboardElementsSchema[];
  emailId!:string|undefined
  isMobileView!:boolean;
  constructor(
    private router: Router,
    private authentication: AuthenticationService,
    private profileService:ProfileService,
    private cartService:CartService
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
    this.dashboardElements = dashboardElements;
    this.profileService.getProfileDetails().subscribe((data)=>{
      this.emailId=data.email
    })
  }

  navigateToNextRoute(title: string) {
    switch (title) {
      case 'Orders':
        this.router.navigate(['profile/orders']);
        break;
      case 'Collections & Wishlist':
        this.router.navigate(['/wishlist']);
        break;
      case 'Profile Details':
        this.router.navigate(['/profile']);
        break;
      case 'Saved Cards':
        this.router.navigate(['profile/cards']);
        break;
      case 'Addresses':
        this.router.navigate(['profile/addresses']);
        break;
    }
  }

  logoutMethod() {
    this.authentication.logoutMethod();
    // this.checkLogin=false
    this.cartService.productsCount.next(0)
  }
}
