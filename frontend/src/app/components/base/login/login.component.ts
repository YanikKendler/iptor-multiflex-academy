import {Component, inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgIf} from "@angular/common";
import {UserDTO, UserEnum, UserService} from "../../../service/user.service";
import {Router, RouterLink, RouterLinkActive} from "@angular/router";
import {Config} from "../../../config";
import * as bcrypt from "bcryptjs";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    ReactiveFormsModule,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent{
  regForm: FormGroup;
  userService = inject(UserService)
  error: string = "";

  constructor(private router: Router) {
    this.regForm = new FormGroup({
      'username': new FormControl(''),
      'email': new FormControl('', [Validators.required, Validators.email]),
      'password': new FormControl('', [Validators.required]),
    })
  }

  onSubmit() {
    if (this.regForm.valid) {

      let userDTO: UserDTO = {
        username: "",
        email: this.regForm.get('email')?.value,
        password: this.regForm.get('password')?.value,
        userType: "CUSTOMER"
      }
      this.userService.login(userDTO).subscribe(response => {
        console.log(response)
        if(response > 0){
          Config.USER_ID = response
          localStorage.setItem('USER_ID', response.toString());
          localStorage.setItem('USER_PASSWORD', userDTO.password);
          this.router.navigate([''])
        } else if (response == -1){
          this.error = "Invalid password"
        } else {
          this.error = "Invalid email"
        }
      })
    }
  }
}
