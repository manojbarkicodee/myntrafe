import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProfileService } from 'src/app/services/profile/profile.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  userName!: string;
  isMobileView!: boolean;
  constructor(private profileService: ProfileService) {}
  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    this.checkScreenWidth();
  }
  ngOnInit(): void {
    this.profileService.getProfileDetails().subscribe((data) => {
      this.userName = data.fullName || 'User';
    });
  }
  checkScreenWidth(): void {
    this.isMobileView = window.innerWidth <= 500; // Adjust the threshold as needed
  }
}
