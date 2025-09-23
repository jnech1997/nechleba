import { Component } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'src/app/services/auth.service';
import { ServerService } from 'src/app/services/server.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: false
})
export class LoginComponent {

  loginFormControl = new UntypedFormGroup({
    username: new UntypedFormControl(''),
    firstName: new UntypedFormControl(''),
    lastName: new UntypedFormControl(''),
    password: new UntypedFormControl('')
  });

  hide = true;
  signup = true;
  requestError: string;
  invalidCredentials = "LOGIN.INVALID_CREDENTIALS";
  returnUrl = "";

  constructor(
    private route: ActivatedRoute, 
    private router: Router,
    private authService: AuthService,
    private server: ServerService,
    private translate: TranslateService
    ) {}

  ngOnInit() {
    if (this.authService.isLoggedIn) {
      this.router.navigate(['/projects/sandbox/profile']);
    }
    else {
      this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/projects/sandbox/profile';
      this.route.data.subscribe((response) => {
        this.signup = response.signup
        if (this.signup) {
          this.loginFormControl.controls['username'].addValidators([Validators.required]);
          this.loginFormControl.controls['password'].addValidators([Validators.required]);
          this.loginFormControl.controls['firstName'].addValidators([Validators.required]);
          this.loginFormControl.controls['lastName'].addValidators([Validators.required]);
        }
        else {
          this.loginFormControl.controls['username'].addValidators([Validators.required]);
          this.loginFormControl.controls['password'].addValidators([Validators.required]);
        }
      }); 
    }
  }

  async onSubmit() {
    if (this.signup) {
      const request = this.server.request('POST', '/signup', {
        username: this.loginFormControl.value?.username,
        firstName: this.loginFormControl.value?.firstName,
        lastName: this.loginFormControl.value?.lastName,
        password: this.loginFormControl.value?.password
      });
      request.subscribe(() => {
        this.router.navigate(['/projects/sandbox/login'], { queryParams: { returnUrl: this.returnUrl } });
      }, (error: any) => {
        this.requestError = error.error;
      });
    }
    else {
      // login 
      let returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/projects/sandbox/profile';
      this.authService.login(this.loginFormControl.value, returnUrl).subscribe((isLoggedIn) => {
        if (!isLoggedIn) {
          this.requestError = this.invalidCredentials;
        }
      })
    }
  }

  toggleRegister() {
    if (this.signup) {
      this.router.navigate(['/projects/sandbox/login'], { queryParams: { returnUrl: this.returnUrl } });
    }
    else {
      this.router.navigate(['/projects/sandbox/signup'], { queryParams: { returnUrl: this.returnUrl } });
    }
  }
}
