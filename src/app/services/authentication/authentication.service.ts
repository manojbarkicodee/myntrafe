import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Authmodel, Loginresponse } from '../../componets/models';
import { ActivatedRoute, Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  token: string = localStorage.getItem("token") || ""

  constructor(private http: HttpClient, private route: ActivatedRoute,private router:Router) { }


  authenticationMethod(signupdata: Authmodel, endpoint: string) {
    return this.http.post<Loginresponse>(`http://localhost:8000${endpoint}`, signupdata)
  }


logoutMethod(){
  localStorage.removeItem('token');
  this.router.navigate([''])
}
  checkUserLogin() {
    let token = localStorage.getItem('token') || ""
    if (token) {
      return true
    } else {
      return false
    }
  }
}
