import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { Subscription } from 'rxjs';
import { QuestionsService } from 'src/app/training/questions.service';
import { getAuth } from 'firebase/auth'

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Output() sidenavToggle = new EventEmitter();
  isAuth: boolean = false;
  authSubscription: Subscription;
  alertInfo: number;
  auth = getAuth();
  userEmail: string = "";

  constructor(private authService: AuthService, private questionService: QuestionsService) {
    setInterval(() => {
      this.alertInfo = this.questionService.alertIcon;
    }, 2000);
  };

  ngOnInit(): void {
    this.authSubscription = this.authService.authChange.subscribe(authStatus => {
      this.isAuth = authStatus;
      this.userEmail = this.auth.currentUser?.email;
    });
  };

  ngOnDestroy(): void {
    this.authSubscription.unsubscribe();
  };

  onToggleSideNav(): void {
    this.sidenavToggle.emit(null);
  };

  onLogout(): void {
    this.authService.logout();
  };
};
