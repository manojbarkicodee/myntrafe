import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Authmodel, Loginresponse, error } from '../../componets/models';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { CartService } from 'src/app/services/cart/cart.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  signupform!: FormGroup;
  signUpformdata!: Authmodel;
  isLogin: boolean = false;
  url!: string;
  responseMessage!: Loginresponse;
  navigateTo!: string;
  errorMessage!: error;
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  constructor(
    private snackBar: MatSnackBar,
    private cartservice: CartService,
    private router: Router,
    private AuthService: AuthenticationService,
    private route: ActivatedRoute
  ) {}
  ngOnInit(): void {
    this.signupform = new FormGroup({
      email: new FormControl('', [Validators.email, Validators.required]),
      password: new FormControl('', [
        Validators.minLength(8),
        Validators.required,
        this.passwordpatternValidator.bind(this),
      ]),
    });

    this.route.queryParams.subscribe((data) => {
      this.navigateTo = data['reference'];
    });

    this.setCurrentUrl();
  }

  setCurrentUrl() {
    this.route.url.subscribe((data) => {
      this.url = data[0].path;
      if (this.url === 'login') {
        this.isLogin = true;
      }
    });
  }

  onSubmit() {
    this.signUpformdata = this.signupform.value;

    this.AuthService.authenticationMethod(
      this.signupform.value,
      '/' + this.url
    ).subscribe({
      next: (data) => {
        if (data.token) {
          this.AuthService.token = data.token;
          localStorage.setItem('token', JSON.stringify(data.token));
          this.router.navigate([this.navigateTo?this.navigateTo:'/']);
          this.cartservice.getProductsCount().subscribe((data) => {
            this.cartservice.productsCount.next(data.productsCount);
          });
        }
        if (data.message) {
          if (data.message === 'signup successfull') {
            this.onChangeMode('login');
          }
          this.showAlert(data.message);
        }
      },
      error: (error) => {
        let {
          error: { message },
        } = error;
        if (message) {
          this.showAlert(message + '!');
        }
      },
      complete: () => {},
    });
  }
  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
      verticalPosition: this.verticalPosition,
      horizontalPosition: this.horizontalPosition,
    });
  }

  showAlert(message: string) {
    this.openSnackBar(message, 'Close');
  }
  onChangeMode(endPoint: string) {
    if (endPoint === 'login') {
      this.isLogin = true;
    } else {
      this.isLogin = false;
    }
    this.router.navigate([endPoint], {
      queryParamsHandling: 'preserve',
    });
  }
  passwordpatternValidator(
    control: FormControl
  ): { [s: string]: boolean } | null {
    let hasNumber = /\d/.test(control.value);
    let hasUpper = /[A-Z]/.test(control.value);
    let hasLower = /[a-z]/.test(control.value);
    let special = /[$@$!%*?&]/.test(control.value);

    if (!hasUpper) {
      return { Upper: true };
    } else if (!hasLower) {
      return { lower: true };
    } else if (!special) {
      return { special: true };
    } else if (!hasNumber) {
      return { Number: true };
    }

    return null;
  }
}
