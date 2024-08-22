import {Component, inject, OnInit} from '@angular/core';
import {Router, RouterOutlet} from '@angular/router';
import {UserDTO, UserEnum, UserLoginDTO, UserService} from "./service/user.service";
import {Config} from "./config";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: []
})
export class AppComponent implements OnInit {
  userService = inject(UserService);
  router = inject(Router)

  ngOnInit(): void {
    let userLoginDTO: UserLoginDTO = {
      userId: localStorage.getItem('USER_ID') ? parseInt(localStorage.getItem('USER_ID')!) : -1,
      password: localStorage.getItem('USER_PASSWORD')!
    }

    console.log(userLoginDTO)
    this.userService.isLoggedIn(userLoginDTO).subscribe(isLoggedIn => {
      console.log(isLoggedIn)
      if (!isLoggedIn) {
        this.router.navigate(['login'])
      }
    })
  }
}
