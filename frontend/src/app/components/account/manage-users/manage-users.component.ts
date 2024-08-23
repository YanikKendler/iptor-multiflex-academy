import { Component } from '@angular/core';
import {User, UserService, UserTreeDTO} from "../../../service/user.service";
import {ManageUserFieldComponent} from "../manage-user-field/manage-user-field.component";
import {NgClass, NgStyle} from "@angular/common";
import {Config} from "../../../config";

@Component({
  selector: 'app-manage-users',
  standalone: true,
  imports: [
    ManageUserFieldComponent,
    NgClass,
    NgStyle
  ],
  templateUrl: './manage-users.component.html',
  styleUrl: './manage-users.component.scss'
})
export class ManageUsersComponent {
  rootUser : UserTreeDTO = {} as UserTreeDTO;

  constructor(private userService: UserService) {
    this.userService.getManageableUsers().subscribe(user => {
      this.rootUser = user
    });
  }
}
