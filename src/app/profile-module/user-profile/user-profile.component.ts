import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProfileService } from 'src/app/services/profile/profile.service';
import {
  checkNumberOrNot,
  checkStringOrNot,
  dateValidators,
} from 'src/app/validators/addressformValidators';
import { profileDetails } from '../model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit, AfterViewInit {
  editMode: boolean = false;
  userDetailsForm!: FormGroup;
  profileDetails!: profileDetails;
  @ViewChild('maleGender') maleGenderElement!: ElementRef<HTMLDivElement>;
  @ViewChild('femaleGender') femaleGenderElement!: ElementRef<HTMLDivElement>;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private profileService: ProfileService,
    private matSnackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.setDefaultFormData();

    this.route.url.subscribe((url) => {
      if (url.length > 0 && url[0].path === 'edit') this.editMode = true;
    });
  }

  ngAfterViewInit(): void {
    if (this.editMode)
      setTimeout(() => {
        if (this.profileDetails.gender === 'male') {
          this.getGender('male', this.maleGenderElement.nativeElement);
        } else if (this.profileDetails.gender === 'female') {
          this.getGender('female', this.femaleGenderElement.nativeElement);
        }
      }, 100);
  }

  openSnackBar(message: string, action: string, panelClass: string) {
    this.matSnackBar.open(message, action, {
      duration: 1000,
      verticalPosition: 'top',
      horizontalPosition: 'right',
      panelClass: [panelClass],
    });
  }

  showAlert(message: string, panelClass: string) {
    this.openSnackBar(message, '', panelClass);
  }

  setDefaultFormData() {
    this.profileService.getProfileDetails().subscribe((data) => {
      this.profileDetails = data;
      this.userDetailsForm = new FormGroup({
        fullName: new FormControl(this.profileDetails.fullName, [
          Validators.required,
          checkStringOrNot.bind(this),
        ]),
        mobileNumber: new FormControl(this.profileDetails.mobileNumber, [
          Validators.required,
          Validators.maxLength(10),
          Validators.minLength(10),
          checkNumberOrNot.bind(this),
        ]),
        email: new FormControl(this.profileDetails.email, [
          Validators.email,
          Validators.required,
        ]),
        gender: new FormControl(this.profileDetails.gender, [
          Validators.required,
        ]),
        birthDate: new FormControl(this.profileDetails.birthDate, [
          Validators.required,
          dateValidators.bind(this),
        ]),
        location: new FormControl(this.profileDetails.location, [
          Validators.required,
          checkStringOrNot.bind(this),
        ]),
        alternateMobileNumber: new FormControl(
          this.profileDetails.alternateMobileNumber,
          [
            Validators.required,
            Validators.maxLength(10),
            Validators.minLength(10),
            checkNumberOrNot.bind(this),
          ]
        ),
      });
    });
  }

  switchToEditMode() {
    this.router.navigate(['/profile/edit'], {});
  }

  getGender(gender: string, element: HTMLElement) {
    let genders = document.querySelectorAll('.gender');
    Array.from(genders).forEach((icon) => {
      let checkicon = icon.querySelector('i');
      checkicon?.classList.add('hideIcon');
    });
    element.classList.remove('hideIcon');
    this.userDetailsForm.patchValue({ gender: gender });
  }

  editUserDetails() {
    let body = { ...this.userDetailsForm.value };
    let [date, month, year] = body.birthDate.split('/');

    body.mobileNumber = body.mobileNumber.toString();
    body.alternateMobileNumber = body.alternateMobileNumber.toString();

    body.birthDate = year + '/' + month + '/' + date;
    this.profileService.editProfileDetails(body).subscribe((data) => {
      if (data.message === 'userDetails updated successfuly') {
        this.router.navigate(['/profile'])
        this.showAlert('Profile details updated successfully', 'success');
      }
    });
  }
}
