import { Component } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent {

  loginFormControl = new UntypedFormGroup({
    username: new UntypedFormControl(''),
    password: new UntypedFormControl('')
  });

  hide = true;

  constructor() { }

  onSubmit() {
    console.log('submitted form: ', this.loginFormControl.value);
  }
}
