import { User } from "./user.model";
import { AuthData } from "./auth-data.model";
import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { Router } from "@angular/router";

@Injectable({ providedIn: "root" })
export class AuthService {
  private user: User;
  authChange = new Subject<boolean>();
  constructor(private router: Router) { }

  registerUser(authData: AuthData) {
    this.user = {
      email: authData.email,
      name: authData.name,
      userId: Math.round(Math.random() * 10000).toString()
    };
    this.authSuccessfully();
  }

  login(authData: AuthData) {
    this.user = {
      email: authData.email,
      name: authData.name,
      userId: Math.round(Math.random() * 10000).toString()
    };
    this.authSuccessfully();
  }

  logout() {
    this.user = null;
    this.authChange.next(false);
    this.router.navigate(["/login"]);
  }

  getUser() {
    return { ...this.user };
  }

  isAuthenticated() {
    return this.user != null;
  }

  private authSuccessfully() {
    this.authChange.next(true);
    this.router.navigate(["/"]);
  }
}