import {Component, inject} from '@angular/core';
import {NavigationComponent} from "../navigation/navigation.component"
import {UserService} from "../../../service/user.service"

@Component({
  selector: 'app-unauthorized',
  standalone: true,
  imports: [
    NavigationComponent
  ],
  templateUrl: './unauthorized.component.html',
  styleUrl: './unauthorized.component.scss'
})
export class UnauthorizedComponent {
  protected userService = inject(UserService)
}
