import { Component } from '@angular/core';
import {User, UserService} from "../../../service/user.service";
import {ManageUserFieldComponent} from "../manage-user-field/manage-user-field.component";

@Component({
  selector: 'app-manage-users',
  standalone: true,
  imports: [
    ManageUserFieldComponent
  ],
  templateUrl: './manage-users.component.html',
  styleUrl: './manage-users.component.scss'
})
export class ManageUsersComponent {
  users : User[] = [];

  constructor(private userService: UserService) {
    this.userService.getManageableUsers().subscribe(users => {
      this.users = users;
    });
  }
}
