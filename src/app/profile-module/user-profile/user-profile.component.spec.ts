import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';

import { UserProfileComponent } from './user-profile.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import {
  ActivatedRoute,
  Router,
  UrlSegment,
  convertToParamMap,
} from '@angular/router';
import { ProfileService } from 'src/app/services/profile/profile.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of } from 'rxjs';
import { profileDetails } from 'src/app/testing/mockData';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';

describe('UserProfileComponent', () => {
  let component: UserProfileComponent;
  let fixture: ComponentFixture<UserProfileComponent>;
  let routerSpy: jasmine.SpyObj<Router>;
  let routeSpy: ActivatedRoute;
  let profileServiceSpy: jasmine.SpyObj<ProfileService>;
  let matSnackBarSpy: jasmine.SpyObj<MatSnackBar>;

  beforeEach(async () => {
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);
    const routeSpyObj = {
      url: of([{ path: 'mockPath' }]),
      params: of({ category: 'testCategory' }),
      queryParams: of({}),
      snapshot: {
        paramMap: convertToParamMap({}), // Use convertToParamMap to simulate paramMap
        queryParams: {},
      },
    };
    const profileServiceSpyObj = jasmine.createSpyObj('ProfileService', [
      'getProfileDetails',
      'editProfileDetails',
    ]);
    const matSnackBarSpyObj = jasmine.createSpyObj('MatSnackBar', ['open']);
    await TestBed.configureTestingModule({
      declarations: [UserProfileComponent],
      imports: [HttpClientTestingModule, SharedModule, ReactiveFormsModule],
      providers: [
        { provide: Router, useValue: routerSpyObj },
        { provide: ActivatedRoute, useValue: routeSpyObj },
        { provide: ProfileService, useValue: profileServiceSpyObj },
        { provide: MatSnackBar, useValue: matSnackBarSpyObj },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UserProfileComponent);
    component = fixture.componentInstance;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    routeSpy = TestBed.inject(ActivatedRoute);
    profileServiceSpy = TestBed.inject(
      ProfileService
    ) as jasmine.SpyObj<ProfileService>;
    matSnackBarSpy = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;
    profileServiceSpy.getProfileDetails.and.returnValue(of(profileDetails));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should call setDefaultFormData and set editMode to true', () => {
      spyOn(component, 'setDefaultFormData');
      routeSpy.url = of([{ path: 'edit' } as UrlSegment]);
      component.ngOnInit();
      expect(component.setDefaultFormData).toHaveBeenCalled();
      expect(component.editMode).toBeTruthy();
    });
    it('should call setDefaultFormData and not set editMode to true', () => {
      spyOn(component, 'setDefaultFormData');
      component.ngOnInit();
      expect(component.setDefaultFormData).toHaveBeenCalled();
      expect(component.editMode).toBeFalsy();
    });
  });
  describe('ngAfterViewInit', () => {
    it('should call getGender if editMode is true and gender is male', fakeAsync(() => {
      component.editMode = true;
      component.profileDetails = { gender: 'male' } as any;
      component.maleGenderElement = {
        nativeElement: document.createElement('div'),
      };
      spyOn(component, 'getGender');

      component.ngAfterViewInit();
      tick(100);
      expect(component.getGender).toHaveBeenCalledWith(
        'male',
        component.maleGenderElement.nativeElement
      );
    }));
    it('should call getGender if editMode is true and gender is female', fakeAsync(() => {
      component.editMode = true;
      component.profileDetails = { gender: 'female' } as any;
      component.femaleGenderElement = {
        nativeElement: document.createElement('div'),
      };
      spyOn(component, 'getGender');

      component.ngAfterViewInit();
      tick(100);
      expect(component.getGender).toHaveBeenCalledWith(
        'female',
        component.femaleGenderElement.nativeElement
      );
    }));
  });
  describe('openSnackBar', () => {
    it('should open snackbar with provided message, action, and panelClass', () => {
      const message = 'Test Message';
      const action = 'Test Action';
      const panelClass = 'test-panel-class';

      component.openSnackBar(message, action, panelClass);

      expect(matSnackBarSpy.open).toHaveBeenCalledWith(message, action, {
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
        '',
        'test-panel-class'
      );
    });
  });

  describe('setDefaultFormData', () => {
    it('should set form values based on profile details', () => {
      profileServiceSpy.getProfileDetails.and.returnValue(of(profileDetails));

      component.setDefaultFormData();

      expect(component.profileDetails).toEqual(profileDetails);

      expect(component.userDetailsForm.get('fullName')?.value).toEqual(
        profileDetails.fullName
      );
      expect(component.userDetailsForm.get('mobileNumber')?.value).toEqual(
        profileDetails.mobileNumber
      );
      expect(component.userDetailsForm.get('email')?.value).toEqual(
        profileDetails.email
      );
      expect(component.userDetailsForm.get('gender')?.value).toEqual(
        profileDetails.gender
      );
      expect(component.userDetailsForm.get('birthDate')?.value).toEqual(
        profileDetails.birthDate
      );
      expect(component.userDetailsForm.get('location')?.value).toEqual(
        profileDetails.location
      );
      expect(
        component.userDetailsForm.get('alternateMobileNumber')?.value
      ).toEqual(profileDetails.alternateMobileNumber);
    });
  });

  describe('switchToEditMode', () => {
    it('should navigate to /profile/edit', () => {
      component.switchToEditMode();
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/profile/edit'], {});
    });
  });

  describe('getGender', () => {
    it('should remove hideIcon class and update gender', () => {
      let element = document.createElement('div');
      spyOn(element.classList, 'remove');
      let genders = document.querySelectorAll('.gender');
      component.getGender('male', element);
      Array.from(genders).forEach((icon) => {
        let checkicon = icon.querySelector('i') as HTMLElement;
        spyOn(checkicon?.classList, 'add');
        expect(checkicon.classList.add).toHaveBeenCalledWith('hideIcon');
        // checkicon?.classList.add('hideIcon');
      });
      expect(element.classList.remove).toHaveBeenCalledWith('hideIcon');
      expect(component.userDetailsForm.value.gender).toEqual('male');
    });
  });

  describe('editUserDetails', () => {
    it('should call editProfileDetails with modified body and navigate /profile and call showAlert if correct msg from response', () => {
      fixture.detectChanges();
      spyOn(component, 'showAlert');
      let succes = {
        statusCode: 200,
        status: 'updated',
        message: 'userDetails updated successfuly',
      };

      profileServiceSpy.editProfileDetails.and.returnValue(of(succes));
      component.editUserDetails();
      console.log(component.userDetailsForm.value);
      expect(profileServiceSpy.editProfileDetails).toHaveBeenCalled();
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/profile']);
      expect(component.showAlert).toHaveBeenCalledWith(
        'Profile details updated successfully',
        'success'
      );
    });
    it('should call editProfileDetails with modified body and doesn"t navigate /profile and doesn"t call showAlert if correct msg is not from response', () => {
      fixture.detectChanges();
      spyOn(component, 'showAlert');
      let succes = {
        statusCode: 200,
        status: 'updated',
        message: '',
      };

      profileServiceSpy.editProfileDetails.and.returnValue(of(succes));
      component.editUserDetails();
      console.log(component.userDetailsForm.value);
      expect(profileServiceSpy.editProfileDetails).toHaveBeenCalled();
      expect(routerSpy.navigate).not.toHaveBeenCalledWith(['/profile']);
      expect(component.showAlert).not.toHaveBeenCalledWith(
        'Profile details updated successfully',
        'success'
      );
    });
  });
});
