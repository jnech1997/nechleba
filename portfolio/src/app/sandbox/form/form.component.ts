import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent {

  loginFormControl = new FormGroup({
    username: new FormControl(''),
    password: new FormControl('')
  });

  hide = true;

  constructor() { }

  onSubmit() {
    console.log('submitted form: ', this.loginFormControl.value);
  }
}
