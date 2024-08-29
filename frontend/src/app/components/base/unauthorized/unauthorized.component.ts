import {Component, inject} from '@angular/core';
import {NavigationComponent} from "../navigation/navigation.component"
import {UserService} from "../../../service/user.service"
import {MatButton} from "@angular/material/button"
import {ActivatedRoute, RouterLink} from "@angular/router"

@Component({
  selector: 'app-unauthorized',
  standalone: true,
  imports: [
    NavigationComponent,
    MatButton,
    RouterLink
  ],
  templateUrl: './unauthorized.component.html',
  styleUrl: './unauthorized.component.scss'
})
export class UnauthorizedComponent {
  protected userService = inject(UserService)
  protected route = inject(ActivatedRoute)
  rerouteType: string = 'unknown reroute'


  constructor() {
    this.rerouteType = this.route.snapshot.queryParams['rerouteType']
  }
}
