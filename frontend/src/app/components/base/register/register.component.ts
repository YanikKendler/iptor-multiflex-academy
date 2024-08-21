// src/app/components/base/register/register.component.ts
import {Component, inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {UserDTO, UserEnum, UserService} from "../../../service/user.service";
import {TextfieldComponent} from "../../basic/textfield/textfield.component";
import {NgIf} from "@angular/common";
import {NavigationComponent} from "../../navigation/navigation.component";
import {ActivatedRoute, Router, RouterLink, RouterLinkActive} from "@angular/router";
import {Config} from "../../../config";
import * as bcrypt from 'bcryptjs';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, TextfieldComponent, ReactiveFormsModule, NgIf, NavigationComponent, RouterLink, RouterLinkActive],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent{
  regForm: FormGroup;
  userService = inject(UserService)
  router: Router = inject(Router);

  constructor() {
    this.regForm = new FormGroup({
      'username': new FormControl(''),
      'email': new FormControl('', [Validators.required, Validators.email]),
      'password': new FormControl('', [Validators.required, Validators.minLength(8)]),
    })
  }

  onSubmit() {
    if (this.regForm.valid) {
      const hashedPassword = bcrypt.hashSync(this.regForm.get('password')?.value, 10);

      let userDTO: UserDTO = {
        username: this.regForm.get('username')?.value,
        email: this.regForm.get('email')?.value,
        password: hashedPassword,
        userType: UserEnum.CUSTOMER
      }
      this.userService.createUser(userDTO).subscribe(response => {
        Config.USER_ID = response
        this.router.navigate([''])
      }, error => {
        console.error(error)
      })
    }
  }
}
