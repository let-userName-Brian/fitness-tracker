import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { getAuth } from 'firebase/auth'

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  auth = getAuth();
  userEmail: string = "";
  constructor(private authService: AuthService) { }

  ngOnInit(): void {
  };

  onSubmit(form: NgForm) {
    this.authService.registerUser({
      name: form.value?.userName,
      email: form.value.email,
      password: form.value.password
    });
  };
};
