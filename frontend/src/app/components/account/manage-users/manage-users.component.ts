import {Component, inject} from '@angular/core';
import {User, UserRoleEnum, UserService, UserTreeDTO} from "../../../service/user.service";
import {ManageUserFieldComponent} from "../manage-user-field/manage-user-field.component";
import {NgClass, NgStyle} from "@angular/common";
import {Config} from "../../../config";
import {MatButton} from "@angular/material/button"

@Component({
  selector: 'app-manage-users',
  standalone: true,
  imports: [
    ManageUserFieldComponent,
    NgClass,
    NgStyle,
    MatButton
  ],
  templateUrl: './manage-users.component.html',
  styleUrl: './manage-users.component.scss'
})
export class ManageUsersComponent {
  rootEmployee : UserTreeDTO = {} as UserTreeDTO;
  customers: UserTreeDTO[] = []

  protected userService= inject(UserService)

  selectedTab: "employees" | "customers" = "employees"

  constructor() {
    this.userService.currentUser.subscribe(user => {
      this.fetchData()
    })
  }

  fetchData(){
    console.log("fetching data")

    this.userService.getManageableUsers().subscribe(user => {
      this.rootEmployee = user
      console.log(this.rootEmployee)
    });

    if(this.userService.currentUser.value.userRole == UserRoleEnum.ADMIN)
      this.userService.getCustomerTree().subscribe(customers => {
        this.customers = customers
        console.log(customers)
      });
  }

  protected readonly UserRoleEnum = UserRoleEnum
}
