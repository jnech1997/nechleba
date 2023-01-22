import { Component } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ServerService } from 'src/app/services/server.service';
import { skip } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  loginFormControl = new UntypedFormGroup({
    email: new UntypedFormControl(''),
    firstName: new UntypedFormControl(''),
    lastName: new UntypedFormControl(''),
    password: new UntypedFormControl('')
  });

  hide = true;
  register = true;
  requestError: string;
  invalidCredentials = "Invalid Credentials";

  constructor(
    private route: ActivatedRoute, 
    private router: Router,
    private authService: AuthService,
    private server: ServerService
    ) {}

  ngOnInit() {
    this.authService.isLoggedIn.subscribe((loggedIn) => {
      if (loggedIn) {
        this.router.navigateByUrl('/sandbox/profile');
      }
    })
    this.route.data.subscribe((response) => {
      this.register = response.register;
      if (this.register) {
        this.loginFormControl.controls['email'].addValidators([Validators.required]);
        this.loginFormControl.controls['password'].addValidators([Validators.required]);
        this.loginFormControl.controls['firstName'].addValidators([Validators.required]);
        this.loginFormControl.controls['lastName'].addValidators([Validators.required]);
      }
      else {
        this.loginFormControl.controls['email'].addValidators([Validators.required]);
        this.loginFormControl.controls['password'].addValidators([Validators.required]);
      }
    });
  }

  async onSubmit() {
    if (this.register) {
      const request = this.server.request('POST', '/register', {
        email: this.loginFormControl.value?.email,
        firstName: this.loginFormControl.value?.firstName,
        lastName: this.loginFormControl.value?.lastName,
        password: this.loginFormControl.value?.password
      });
      request.subscribe(() => {
        this.router.navigateByUrl('/sandbox/login');
      }, (error: any) => {
        this.requestError = error.error;
      });
    }
    else {
      // login 
      this.authService.login(this.loginFormControl.value).subscribe((isLoggedIn) => {
        if (!isLoggedIn) {
          this.requestError = this.invalidCredentials;
        }
      })
    }
  }

  toggleRegister() {
    if (this.register) {
      this.router.navigateByUrl('/sandbox/login');
    }
    else {
      this.router.navigateByUrl('/sandbox/register');
    }
  }
}
