import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {NavController} from '@ionic/angular';
import {AuthService} from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(
      private navCtrl: NavController,
      private authSrv: AuthService,
      private formBuilder: FormBuilder
  ) { }

  validationForm: FormGroup;
  errorMessage = '';

  validationMessages = {
    email: [
      { type: 'required', message: 'Email is required.' },
      { type: 'pattern', message: 'Please enter a valid email.' }
    ],
    password: [
      { type: 'required', message: 'Password is required.' },
    ]
  };

  ngOnInit() {
    this.validationForm = this.formBuilder.group({
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      password: new FormControl('', Validators.compose([
        Validators.minLength(5),
        Validators.required
      ])),
    });
  }

  loginUser(value) {
    this.authSrv.loginUser(value)
        .then(res => {
          console.log(res);
          this.errorMessage = '';
          this.navCtrl.navigateForward('/dashboard');
        }, err => {
          this.errorMessage = err.message;
        });
  }

  goToRegisterPage() {
    this.navCtrl.navigateForward('/register');
  }

}
