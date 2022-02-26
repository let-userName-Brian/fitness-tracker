import { User } from "./user.model";
import { AuthData } from "./auth-data.model";
import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { Router } from "@angular/router";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { ExerciseService } from "../training/exercise.service";

@Injectable({ providedIn: "root" })
export class AuthService {
  private user: User;
  private isUser = false;
  authChange = new Subject<boolean>();
  constructor(private router: Router, private afAuth: AngularFireAuth, private exerciseService: ExerciseService) { }

  registerUser(authData: AuthData) {
    this.afAuth.createUserWithEmailAndPassword(authData.email, authData.password)
      .then(result => {
        console.log(result);
      })
      .catch(error => {
        console.log(error);
      });
  }

  login(authData: AuthData) {
    console.log(authData);
    let username = authData.name
    this.afAuth.signInWithEmailAndPassword(authData.email, authData.password)
    .then(() => {
      this.user = {
        name: username,
      }
    })
    .catch(error => {
      console.log(error);
    });
    console.log(this.user);
  }

  logout() {
    this.afAuth.signOut();
  }

  getUser() {
    return { ...this.user };
  }

  initAuthListener() {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.authChange.next(true);
        this.router.navigate(["/training"]);
        this.isUser = true;
      } else {
        this.exerciseService.cancelSubscriptions();
        this.authChange.next(false);
        this.router.navigate(["/login"]);
        this.isUser = false;
      }
    });
  }

  isAuthenticated() {
    return this.isUser;
  }
}