import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BsDatepickerConfig } from 'ngx-bootstrap';

import { AlertifyService } from '../../services/alertify.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  @Output() cancelRegister = new EventEmitter<any>();

  registerForm: FormGroup;
  bsDatepickerConfig: Partial<BsDatepickerConfig>;

  constructor(private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private alertifyService: AlertifyService) {
  }

  ngOnInit() {
    this.bsDatepickerConfig = {
      containerClass: 'theme-blue'
    };

    this.createRegisterForm();
  }

  private createRegisterForm() {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      knowAs: ['', Validators.required],
      gender: ['male', Validators.required],
      dateOfBirth: [null, Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      password: ['', [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(10)
      ]],
      confirmPassword: ['', Validators.required]
    }, {
        validator: [this.passwordMatchValidator]
      });
  }

  private passwordMatchValidator(g: FormGroup) {
    return g.get('password').value === g.get('confirmPassword').value
      ? null
      : { 'mismatch': true };
  }

  register() {
    if (!this.registerForm.valid) {
      return;
    }

    this.authService.register(this.registerForm.value)
      .subscribe(
        () => this.alertifyService.success('Registered successfully!'),
        error => this.alertifyService.error(error),
        () => {
          const user = { ...this.registerForm.value };
          this.authService.login(user).subscribe(() => {
            this.router.navigate(['/members']);
          });
        }
      );
  }

  cancel() {
    this.cancelRegister.emit(false);
  }

}
