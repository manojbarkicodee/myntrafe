import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavtologinComponent } from './navtologin.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('NavtologinComponent', () => {
  let component: NavtologinComponent;
  let fixture: ComponentFixture<NavtologinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NavtologinComponent ],
      imports:[RouterTestingModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavtologinComponent);
    component = fixture.componentInstance;
    component.dynamicCompData={
      header: 'test header',
      paragraph: 'test12234',
      buttonText: 'login'
    }
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
