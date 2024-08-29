import {Component, inject, OnInit} from '@angular/core';
import {Router, RouterOutlet} from '@angular/router';
import {UserDTO, UserRoleEnum, UserLoginDTO, UserService} from "./service/user.service";
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
      userId: localStorage.getItem('IMA_USER_ID') ? parseInt(localStorage.getItem('IMA_USER_ID')!) : -1,
      password: localStorage.getItem('IMA_USER_PASSWORD')!
    }

    this.userService.isLoggedIn(userLoginDTO).subscribe(response => {
      if (response == null) {
        this.router.navigate(['login'])
      }
      else {
        this.userService.currentUser.next(response)
      }
    })
  }
}
