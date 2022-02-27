import { AuthData } from "./auth-data.model";
import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { Router } from "@angular/router";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { ExerciseService } from "../training/exercise.service";

@Injectable({ providedIn: "root" })
export class AuthService {
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
    this.afAuth.signInWithEmailAndPassword(authData.email, authData.password)
    .then(() => {
     console.log('logged in');
    })
    .catch(error => {
      console.log(error);
    });
  }

  logout() {
    this.afAuth.signOut();
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