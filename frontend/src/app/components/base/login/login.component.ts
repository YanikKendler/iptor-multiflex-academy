import {Component, inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgIf} from "@angular/common";
import {UserDTO, UserRoleEnum, UserLoginDTO, UserService} from "../../../service/user.service";
import {ActivatedRoute, Router, RouterLink, RouterLinkActive} from "@angular/router";
import {Config} from "../../../config";
import * as bcrypt from "bcryptjs";
import {MatButton} from "@angular/material/button"
import {MatRipple} from "@angular/material/core"

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    ReactiveFormsModule,
    RouterLink,
    RouterLinkActive,
    MatButton,
    MatRipple
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit{
  regForm: FormGroup;
  userService = inject(UserService)
  error: string = "";

  mode:"create" | "login" = "login"

  constructor(private router: Router, private route: ActivatedRoute) {
    this.regForm = new FormGroup({
      'username': new FormControl(''),
      'email': new FormControl('', [Validators.required, Validators.email]),
      'password': new FormControl('', [Validators.required]),
    })
  }

  ngOnInit(): void {
    let userLoginDTO: UserLoginDTO = {
      userId: localStorage.getItem('IMA_USER_ID') ? parseInt(localStorage.getItem('IMA_USER_ID')!) : -1,
      password: localStorage.getItem('IMA_USER_PASSWORD')!
    }

    this.userService.isLoggedIn(userLoginDTO).subscribe(isLoggedIn => {
      if (isLoggedIn) {
        this.router.navigate([''])
      }
    })

    const mode = this.route.snapshot.queryParams['mode']
    if(mode == "create") {
      this.mode = "create"
    }
    else {
      this.mode = "login"
    }
  }

  changeMode(mode: "create" | "login") {
    this.error = ""
    this.mode = mode
    this.router.navigate(['login'], {queryParams: {mode: mode}})
  }

  onSubmit(isRegister: boolean) {
    if (this.regForm.valid) {

      let userDTO: UserDTO = {
        username: this.regForm.get('username')?.value,
        email: this.regForm.get('email')?.value,
        password: this.regForm.get('password')?.value,
        userRole: "CUSTOMER"
      }

      if(isRegister) {
        this.userService.createUser(userDTO).subscribe(response => {
          if(response != null){
            this.userService.updateCurrentUser(response)
            localStorage.setItem('IMA_USER_ID', response.userId.toString());
            localStorage.setItem('IMA_USER_PASSWORD', userDTO.password);
            this.router.navigate([''])
          } else {
            this.error = "Email or username already in use"
          }
        })
        return
      }

      this.userService.login(userDTO).subscribe(response => {
        if(response != null){
          this.userService.updateCurrentUser(response)

          localStorage.setItem('IMA_USER_ID', response.userId.toString());
          localStorage.setItem('IMA_USER_PASSWORD', userDTO.password);
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
