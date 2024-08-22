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

  constructor(private router: Router) {
    this.regForm = new FormGroup({
      'username': new FormControl(''),
      'email': new FormControl('', [Validators.required, Validators.email]),
      'password': new FormControl('', [Validators.required, Validators.minLength(4)]),
    })
  }

  onSubmit() {
    if (this.regForm.valid) {
      let userDTO: UserDTO = {
        username: this.regForm.get('username')?.value,
        email: this.regForm.get('email')?.value,
        password: this.regForm.get('password')?.value,
        userType: "CUSTOMER"
      }
      this.userService.createUser(userDTO).subscribe(response => {
        Config.USER_ID = response
        localStorage.setItem('USER_ID', response.toString());
        localStorage.setItem('USER_PASSWORD', userDTO.password);
        this.router.navigate([''])
      }, error => {
        console.error(error)
      })
    }
  }
}
