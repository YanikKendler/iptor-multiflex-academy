import {Component, inject} from '@angular/core';
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
export class LoginComponent {
  regForm: FormGroup;
  userService = inject(UserService)
  router: Router = inject(Router);

  constructor() {
    this.regForm = new FormGroup({
      'username': new FormControl(''),
      'email': new FormControl('', [Validators.required, Validators.email]),
      'password': new FormControl('', [Validators.required]),
    })
  }

  onSubmit() {
    if (this.regForm.valid) {
      const hashedPassword = bcrypt.hashSync(this.regForm.get('password')?.value, 10);

      let userDTO: UserDTO = {
        username: "",
        email: this.regForm.get('email')?.value,
        password: hashedPassword,
        userType: UserEnum.CUSTOMER
      }
      this.userService.login(userDTO).subscribe(response => {
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
