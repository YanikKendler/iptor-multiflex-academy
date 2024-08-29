import {Component, inject, OnInit} from '@angular/core';
import {UserService, UserStatisticsDTO} from "../../../service/user.service";

@Component({
  selector: 'app-user-statistics',
  standalone: true,
  imports: [],
  templateUrl: './user-statistics.component.html',
  styleUrl: './user-statistics.component.scss'
})
export class UserStatisticsComponent implements OnInit {
  userStatistics : UserStatisticsDTO = {} as UserStatisticsDTO
  userService = inject(UserService)

  ngOnInit(): void {
    this.userService.currentUser.subscribe(user => {
      if(user.userId > 0){
        this.userService.getUserStatistics(this.userService.currentUser.value.userId).subscribe(userStatistics => {
          this.userStatistics = userStatistics
        })
      }
    })
  }
}
