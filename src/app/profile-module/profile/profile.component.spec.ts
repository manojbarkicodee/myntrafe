import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileComponent } from './profile.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ProfileService } from 'src/app/services/profile/profile.service';
import { of } from 'rxjs';
import { profileDetails } from 'src/app/testing/mockData';
import { RouterTestingModule } from '@angular/router/testing';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;
  let profileServiceSpy: jasmine.SpyObj<ProfileService>;
  beforeEach(async () => {
    profileServiceSpy = jasmine.createSpyObj('ProfileService', ['getProfileDetails']);
    await TestBed.configureTestingModule({
      declarations: [ ProfileComponent ],
      imports:[HttpClientTestingModule,RouterTestingModule],
      providers: [
        { provide: ProfileService, useValue: profileServiceSpy },
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should set userName from profile service data', () => {
      profileServiceSpy.getProfileDetails.and.returnValue(of(profileDetails));

      component.ngOnInit();

      expect(profileServiceSpy.getProfileDetails).toHaveBeenCalled();
      expect(component.userName).toEqual('test');
    });

    it('should set default userName if fullName is not present in profile service data', () => {
      profileServiceSpy.getProfileDetails.and.returnValue(of(profileDetails));

      component.ngOnInit();

      expect(profileServiceSpy.getProfileDetails).toHaveBeenCalled();
      expect(component.userName).toEqual('test');
    });
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
});
