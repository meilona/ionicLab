import { Component, OnInit } from '@angular/core';
import {NavController} from '@ionic/angular';
import {AuthService} from '../services/auth.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  validationsForm: FormGroup;
  errorMessage = '';
  successMessage = '';

  validationMessages = {
    email: [
      { type: 'required', message: 'Email is required.'},
      { type: 'pattern', message: 'Enter a valid email.'}
    ],
    password: [
      { type: 'required', message: 'Password is required.'},
      { type: 'minLength', message: 'Password must be at least 5 characters long.'}
    ]
  };

  constructor(
      private navCtrl: NavController,
      private authSrv: AuthService,
      private formBuilder: FormBuilder,
  ) { }

  ngOnInit() {
    this.validationsForm = this.formBuilder.group({
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

  tryRegister(value) {
    this.authSrv.registerUser(value)
        .then(res => {
          console.log(res);
          this.errorMessage = '';
          this.successMessage = 'Your account has been created. Please log in.';
          this.authSrv.loginUser(value).then(() => {
            this.navCtrl.navigateForward('/dashboard');
          });
        }, err => {
          console.log(err);
          this.errorMessage = err.message;
          this.successMessage = '';
        });
  }

  goLoginPage() {
    this.navCtrl.navigateBack('');
  }

}
